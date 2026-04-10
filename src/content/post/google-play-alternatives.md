---
title: Google Play Alternatives
slug: google-play-alternatives
category: In Plaintext
tags:
    - Degoogle
    - Android
    - Apps
---

When it comes to downloading apps on Android, Google Play rules, but although it may seem convenient and there to serve you, it has its drawbacks.

It's dependent on Google Play Services, which is extremely invasive, resource intensive, and isn't available on all devices.

It has strict requirements that developers have to comply with in order to publish their apps there, making it not worth it for some hobbyist developers to put their apps on Google Play.

Additionally, they take a steep 30% tax on all in app purchases and subscriptions made in apps downloaded from there, taking money away developers, and making apps and services more expensive.

The following apps and sites are great alternatives to Google Play, offering better privacy, flexibility, and sometimes apps that aren't available on the Play Store.

---

## Google Play Clients

### Aurora Store

Aurora Store is an open source, privacy friendly app store that doesn't have its own library of apps. Instead, it downloads them directly from Googles servers, using reverse engineered unofficial Google Play APIs.

It allows you to spoof your region and device model, allowing you to access apps that might not otherwise be available to you.

Aurora lets you install apps using Androids native installer, Shizuku, and root, and [this fork](https://github.com/alltechdev/dhizuku-app-installer) also offers an option to install with Dhizuku.

https://auroraoss.com/

https://github.com/whyorean/AuroraStore

https://apt.izzysoft.de/fdroid/index/apk/com.aurora.store

- - -

### GPlay APK Downloader

GPlay APK Downloader is a website that like Aurora, downloads apps from Googles servers, but you don't need to install any store to use APK-dl.
Instead, you just download the APK to your phone, and can install the app directly, without any store.

It also offers an option to install apps directly from the site to your device, using web ADB.

GPlay APK Downloader is the best option for downloading apps from Google Play without having to use an app store.

https://apkdl.dietdroid.com/

- - -

## FOSS app repositories

### F-Droid

F-Droid is a repository of apps that are all open source.

Ironically, since most of these apps are built by hobbyist and end users instead of companies chasing profits, these apps are often higher quality than what you'll find on other app stores.

Since all apps on F-Droid are open source, it's the most secure source of apps, with the lowest chances of having malware.

You can get apps from F-Droid using their website, their official app store, or using third party clients like [**Droidify**](https://github.com/Droid-ify/client), or [**Florid**](https://apt.izzysoft.de/packages/com.nahnah.florid).

https://f-droid.org/en/

https://github.com/f-droid

### IzzyOnDroid

Izzyondroid is another repository of open source apps, designed to work with regular F-Droid clients.

It has some differing philosophies than F-Droid, leading to it having a larger selection of apps than F-Droid.

It can be accessed the same ways as F-Droid, through it's website and through F-Droid Clients, and the Droididfy F-Droid client comes with IzzyOnDroid enabled out of the box.


https://apt.izzysoft.de/fdroid

- - -

## Sites that host apps themselves

APKMirror, Uptodown, and APKpure are the best sites to download proprietary apps from, that host apps the apps themselves.

The differences between these are security, curation, and the app store experience.


### APKMirror

APKMirror is one of the most secure sites for downloading apps that are also available on Google Play.

They only host apps that are already available on Google Play, relying on the fact that Google vets apps before allowing it on to the Play Store.

They use signature verification to ensure that the APK they're giving you is authentic and wasn't tampered with.

It's downside is that it doesn't have an app store to install apps directly to your phone.

You have to first download the APK from their website, and then manually install it.

https://www.apkmirror.com/

### Uptodown

Uptodown is another Google Play alternative with their own database of apps.

Unlike APKMirror, Uptodown also offers apps that aren't available on Google Play, which means that you can get apps that weren't vetted by Google, but they have their own security features to protect you from malware.

All apps are automatically scanned by VirusTotal, and the results are shown on the apps page, letting you choose if you want to trust the app.

Like APKMirror, Uptodown enforces signature verification, so if an app is also available on Google Play, then what Uptodown is giving you is guaranteed to be authentic.

Uptodown has it's own app store, allowing you to search for, install, and update apps directly with their app, making things a lot simpler than APKMirror.

https://en.uptodown.com

### APKpure

APKPure is the most popular website for downloading apps, but it isn't necessarily the best.

While currently it's security is pretty much on par with APKMirror and Uptodown, it has had incidents in the past, staining its reputution, even though they've significantly upped their security since then.

APKPure allows you to choose which regional variant of an app to install.

Its bots scrape Google Play aggresively, often being the first one to offer updates to apps from when they're released.

It also is the only one to copy Google Plays ability to follow and get news on apps that weren't yet released.

They also keep the most archives of older versions of apps.

https://apkpure.com/

- - -

## XAPK, APKM, APKS - What happened to the simple APK?

For the first 10 plus years, Android apps were built and installed as APK files.

Even if you got your apps from GOogle Play, the Play store and Google Plays servers were dealing  with APK files, and if you got your apps from other sources, it was as simple as donwloading an APK file and installing it from Android file mananger.

If you're trying to download APKs from websites, you might notice that many apps aren't available as APKs anymore.

Instead, you'll be offered XAPKs, APKMs, APKS's, and other formats.

The reason for that is that Google has changed how apps are built and delivered, moving from monolithic APKs to split APKs.

It used to be that the entire app, with all its code designed for different processor architectures, screen, sizes, and languages, would all be bundled into a single APK file. This  meant that the app could take up a lot of space on your phone for componenets that you'd never use.

Now, with split APKs, device specific components get generated as separate APKs, and your phone only gets the parts it needs.

While this is a lot more efficient, the APK file format can't bundle multiple APKs in it, and Google didn't give us a file format that could bundle multiple APks third, leaving us without a way to distribute split APKs outside of the Play Store.

A bunch of different vendors each tried solving this, leaving us with a bunch of new formats.

XAPK is the most popular, but APKS is also popular and widely supported.

Since Android doesn't natively support these formats, you'll have to use an installer app to install apps from these format
There are a bunch of great FOSS ones, including [InstallerX Revived](https://github.com/wxxsfxyzm/InstallerX-Revived), [Package Manager](https://smartpack.github.io/PackageManager/), [Package Installer](https://github.com/SanmerApps/PI), and [Spli App Installer](https://github.com/aefyr/SAI).

https://github.com/wxxsfxyzm/InstallerX-Revived/blob/main/docs/README.md

https://smartpack.github.io/PackageManager/

https://github.com/SanmerApps/PI/blob/main/README.md

https://github.com/Aefyr/SAI/blob/master/README.md

## Armv8, armv7, and x86 builds

Some developers, instead of distributing apps as split APK formats that aren't natively supported, choose to just build multiple APK for each device type.

The most important thing to focus on is processor architecture.
You might see APKs for armv8, sometimes reffered to as x64, armv7, and x86.

Most modern Android devices are armv8.

Older devices and Android dumbphones might be armv7.

x86 builds are for Chromebooks with AMD/Intel processors, and Androifd emulators on PCs.