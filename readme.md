> Only work for windows

A quick tool to clean adb environment


**I would like to check connected devices**

```
$ adb devices
> adb server is out of date.  killing...
> ADB server didn't ACK
> * failed to start daemon *
> error: unknown host service
```

**Try again**

```
$ adb devices
> adb server is out of date.  killing...
> ADB server didn't ACK
> * failed to start daemon *
> error: unknown host service
```

**FUCK it!***

```
$ node index
> ...
> ...
$ adb devices
> List of devices attached
> f1bbba  device
> f2abdk  device
```

**That's COOL**

# Usage
`node index`