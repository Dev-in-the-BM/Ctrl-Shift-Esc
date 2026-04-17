#!/usr/bin/env bash
#
# convert-to-reddit.sh - Convert a blog post to Reddit markdown format
# Usage: ./convert-to-reddit.sh [file.md]
#

set -e

POST_DIR="src/content/post"
OUTPUT_DIR=".reddit-posts"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Function to pick a file using fzf if available, otherwise use select
pick_file() {
    local files=("$@")
    local file
    
    if command -v fzf &> /dev/null; then
        # Use fzf if available
        file=$(printf '%s\n' "${files[@]}" | fzf --prompt="Select a post to convert: ")
    else
        # Fallback to bash select
        echo "Select a post to convert:"
        select file in "${files[@]}"; do
            if [ -n "$file" ]; then
                break
            fi
        done
        echo "$file"
        return 0
    fi
    echo "$file"
}

# Get list of markdown files
mapfile -t POST_FILES < <(find "$POST_DIR" -maxdepth 1 -name "*.md" -type f | sort)

if [ ${#POST_FILES[@]} -eq 0 ]; then
    echo "No post files found in $POST_DIR"
    exit 1
fi

# Allow passing file as argument
if [ -n "$1" ] && [ -f "$1" ]; then
    SELECTED_FILE="$1"
elif [ -t 0 ]; then
    # stdin is a terminal - use interactive selection
    if command -v fzf &> /dev/null; then
        SELECTED_FILE=$(printf '%s\n' "${POST_FILES[@]}" | fzf --prompt="Select a post to convert: ")
    else
        echo "Select a post to convert:"
        select SELECTED_FILE in "${POST_FILES[@]}"; do
            [ -n "$SELECTED_FILE" ] && break
        done
    fi
else
    # stdin is not a terminal - read selection number
    read -r selection
    if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#POST_FILES[@]}" ]; then
        SELECTED_FILE="${POST_FILES[$((selection-1))]}"
    else
        echo "Invalid selection: $selection"
        exit 1
    fi
fi

if [ -z "$SELECTED_FILE" ] || [ ! -f "$SELECTED_FILE" ]; then
    echo "No file selected. Exiting."
    exit 0
fi

echo "Selected: $SELECTED_FILE"

# Extract frontmatter using awk (more reliable)
FRONTMATTER=$(awk '/^---$/ && !first { first=1; next } first && /^---$/ { exit } first' "$SELECTED_FILE")

# Extract article content (everything after the second ---)
ARTICLE=$(awk '/^---$/ && ++c == 2 { found=1; next } found { print } found && /^---$/ { exit }' "$SELECTED_FILE")

# Extract required fields from frontmatter
TITLE=$(echo "$FRONTMATTER" | sed -n 's/^title: *\(.*\)$/\1/p')
SLUG=$(echo "$FRONTMATTER" | sed -n 's/^slug: *\(.*\)$/\1/p')

# Extract excerpt using awk - handle multiline YAML block format
# Get lines after "excerpt:" until next key at column 0
EXCERPT=$(echo "$FRONTMATTER" | awk '/^excerpt:/{
    found=1
    sub(/^excerpt: ["|][-|]?/, "")
    printf "%s", $0
    next
}
found && /^[[:space:]]/ {
    sub(/^[[:space:]]*/, "")
    printf " %s", $0
    next
}
found && /^[a-zA-Z]/ {
    exit
}
END {
    print ""
}' | tr -d '|' | xargs)

# Fallback for description if excerpt still empty
if [ -z "$EXCERPT" ]; then
    EXCERPT=$(echo "$FRONTMATTER" | awk '/^description:/{
        found=1
        sub(/^description: ["|][-|]?/, "")
        printf "%s", $0
        next
    }
    found && /^[[:space:]]/ {
        sub(/^[[:space:]]*/, "")
        printf " %s", $0
        next
    }
    found && /^[a-zA-Z]/ {
        exit
    }
    END {
        print ""
    }' | tr -d '|' | xargs)
fi

# Process the article content - remove grids, details, boxes, and images
if command -v perl &> /dev/null; then
    # Use perl for better multiline regex handling
    ARTICLE=$(echo "$ARTICLE" | perl -0777 -pe '
        # Strip leading whitespace from each line first
        s/^[ \t]+//gm;
        # Remove :::grid blocks with content
        s/:::grid\[[^\]]*\]\n.*?:::\n//gs;
        s/:::grid\n.*?:::\n//gs;
        # Remove :::details blocks with content  
        s/:::details\[[^\]]*\]\n.*?:::\n//gs;
        s/:::details\n.*?:::\n//gs;
        # Remove :::box blocks with content
        s/:::box\[[^\]]*\]\n.*?:::\n//gs;
        s/:::box\n.*?:::\n//gs;
        # Remove all images, including inline emojis
        s/!\[[^\]]*\]\([^)]*\)/ /g;
        # Remove HTML tags like <br>
        s/<[^>]+>//g;
        # Clean up multiple spaces
        s/  +/ /g;
    ')
else
    # Fallback to bash line-by-line processing
    in_block=0
    ARTICLE=$(echo "$ARTICLE" | while IFS= read -r line; do
        # Check for block starts
        if [[ "$line" =~ ^:::grid ]]; then
            in_block=1
        elif [[ "$line" =~ ^:::details ]]; then
            in_block=1
        elif [[ "$line" =~ ^:::box ]]; then
            in_block=1
        elif [[ "$line" =~ ^:::\s*$ ]] && [ "$in_block" -eq 1 ]; then
            in_block=0
        elif [ "$in_block" -eq 0 ]; then
            # Remove images and clean up line
            echo "$line" | perl -pe 's/!\[[^\]]*\]\([^)]*\)/ /g; s/  +/ /g'
        fi
    done)
fi

# Clean up extra blank lines
ARTICLE=$(echo "$ARTICLE" | sed '/^$/d')

# Build the Reddit-compatible output
REDDIT_POST="# $TITLE

$EXCERPT

**[Click here](https://ctrl-shift-esc.devinthebm.workers.dev/$SLUG) to see the full version of this article.**

$ARTICLE"

# Generate output filename
BASENAME=$(basename "$SELECTED_FILE" .md)
OUTPUT_FILE="$OUTPUT_DIR/${BASENAME}_reddit.md"

# Save the result
echo "$REDDIT_POST" > "$OUTPUT_FILE"

echo "Converted post saved to: $OUTPUT_FILE"
echo ""
echo "Preview:"
echo "========================================"
cat "$OUTPUT_FILE"
echo "========================================"