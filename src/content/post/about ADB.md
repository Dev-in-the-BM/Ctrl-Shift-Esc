---
title: "Dumbing down your smartphone, smarting up your dumbphone, and more: ADB for dummies"
category:
    - Dialing Down
tags:
    - ADB
    - Android
---

**What is ADB?**

ADB is a tool that you can use from your computer to do a lot things to Android phones that can't be done from the phone itself.

**Why can I do with ADB?**

ADB lets you:

 - **Uninstall apps**
- **Install apps**
- **Manage app permissions**
- **Change phone settings**

Often, ADB will let you do more than the phone itself lets.

You can use it to uninstall apps that came with the phone, install apps on some dumbphones that restrict installing APKs directly on the phone, and change phone settings and app permissions that you can't set from the phone itself.

**Why ADB?**

All this can be very useful for dumbing down devices, and extending the functionality of dumbphones.

**Do I have to learn how to type up commands to use ADB?**

While ADB is really a command line tool, there are a bunch of easy to use GUI apps that let you use a lot of ADB features without  having to know any ADB commands.

Here are some of the best ones:

If you *do* want to learn about using ADB the old fashioned way, here are some useful commands:

`adb devices` shows which devices are connected to the computer.

`adb reboot` restarts the phone.

Many commands start with `adb shell`.

PM is the package manager, which deals with apps.

`adb shell pm list` will list all installed apps.

`adb shell pm list -3` lists all third party apps you installed.

`adb shell pm install {path to APK on the phone}` will install an APK that's on your phone.

`adb shell pm uninstall {package name}` will uninstall an installed app.

`adb shell pm uninstall , {package name}` only uninstalls the app from the phones main user. This can be useful for uninstalling apps that can't be completely removed removed from the phone, like apps that came with the phone.