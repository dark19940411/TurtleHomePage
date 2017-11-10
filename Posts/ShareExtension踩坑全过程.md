---
title: ShareExtension踩坑过程全记录
date: 2017-04-07 12:07:46
tags:
---

## 前言  
这是一篇记录踩坑的文章，而不是教程，所以如果你打算用这篇文章开启你ShareExtension世界的大门，那么你来错地方了。但是如果你已经对ShareExtension有所了解，打算开发一个ShareExtension，那这篇文章所提到的内容将有可能对你有所帮助。

## 第一坑——繁琐的取数据过程
假如你写过ShareExtension，那么你知道一段从extension里获取所选文件的过程可能长这样：
```objc
[self.extensionContext.inputItems enumerateObjectsUsingBlock:^(NSExtensionItem  * extItem, NSUInteger idx, BOOL * stop) {  
        //选择了多少个文件就有多少个attachments
        [extItem.attachments enumerateObjectsUsingBlock:^(NSItemProvider * itemProvider, NSUInteger idx, BOOL * stop) {  
            //为了方便，所以这里直接对itemProvider.registeredTypeIdentifiers进行了遍历处理，表示接受所有文件类型。实际上你是要按你所需要的类型进行筛选的。
            for (NSString * typeId in itemProvider.registeredTypeIdentifiers) {
                [itemProvider loadItemForTypeIdentifier:typeId options:nil completionHandler:^(id<NSSecureCoding>   item, NSError *  error) {
                    //进入到异步线程里了

                    //item多数情况下是文件在本地沙盒下的url，让你通过这个url去读取它。但是根据文档，它还有可能是NSData，不过我并没有遇到过这种情况。

                    //获取文件，通常再通过app group来存储到和宿主程序（host app）共用的plist里实现分享到主程序的功能。但是注意一点，share extension并不能打开宿主程序（然而有黑科技可以实现这个功能，见下文）。

                    if (error) {
                        NSLog(@"%@", error.localizedDescription);
                    }

                    dispatch_async(dispatch_get_main_queue(), ^{
                          [self.extensionContext completeRequestReturningItems:@[extItem] completionHandler:nil];
                    });
                }];

            }
        }];
}];
```

从代码里可以看到，为了取到数据，我嵌套遍历了很多重。你要在share extension里面获取到用户所选取的文件，你得通过`self.extensionContext.inputItems[0].attachments[0].itemProvider`去`loadItemForTypeIdentifier:completionHandler:` ... 这真是一个有够长的链式调用，多得让人感觉总有一些属性是多余的。  

而在实际应用中，当你的Share Extension触发起上面那段代码的时候，`self.extensionContext.inputItems`往往只有一个，而`NSExtensionItem`的`attachments`里存放的对象的数量恰好是被选择分享的文件的数量。而`attachments`里都是`NSItemProvider`，`NSItemProvider`对应的就是每个被选取的文件，可是一个`NSItemProvider`却不仅仅只有一个`typeIdentifier`，它可能有多个`typeIdentifier`——比如一个pdf会有两个typeIdentifier:一个是`"public.file-url"`，一个是`"com.adobe.pdf"`。在这之中，`"public.file-url"`是一个通用的type，由他可以直接获取到当前`NSItemProvider`的url，而另外一个是PDF独有的`typeIdentifier`，同样的例如.doc, .ppt这些文件也有一个，专门用来告诉你它是什么类型的文件的。  

## 第二坑——打不开宿主程序（host app)
写过extensions的我们知道要从extension打开宿主程序通常是使用`self.extensionContext`的`-openURL:completionHandler:`方法。但是这个方法在share extension里使用会直接crash（[参考这里](http://stackoverflow.com/questions/27506413/share-extension-to-open-host-app)）。并且在官方文档上也表明，share extension不能打开主程序。  
但是`openURL`方法不适用，不代表就没有办法打开宿主程序了。这里有一个比较间接的方法，可以打开宿主程序，但是不保证你使用了这个方法能够通过苹果的审核，这个方法就是用`SFSafari​View​Controller`来打开你的宿主程序的URL，这样就能从share extension跳转到host app了。  

## 第三坑——App Icon在模拟器中不显示  
在开发share extension的过程中，我发现模拟器里的的share extension的icon一直是非常丑的一个白色的默认的开发图标，就连我在share extension的`assets catalog`添加了App Icon都没有反应。于是，经过了一顿查阅，我发现了share extension的app icon是跟宿主程序一样的，在`assets catalog`里添加的App Icon也会被忽略。根据这一点，我在模拟器里无论是删应用，重启，还是换模拟器，都没用。为此我甚至在stackoverflow上问了[一个问题](http://stackoverflow.com/questions/43114881/ios-share-extensions-app-icon-not-showing-up)，最终也没有得到回答。  
后来我将应用装到真机上，App Icon就出现了:)。顺带一提，我的Xcode版本是8.2。  

## 第四坑——Share Extension的应用名的国际化
首先得在extension的`info.plist`里添加一个`LSHasLocalizedDisplayName`的键，值填YES(类型是布尔)。完了再创建一个叫`InfoPlist.strings`（请注意大小写）的多语言文件，里面添加`CFBundleDisplayName`的键值就可以实现对extension的应用名的国际化。但是正是这么简单的一个过程，却难住了我。创建的多语言文件必须得叫`InfoPlist.strings`，只要差一个字母`CFBundleDisplayName`就完全不起作用，大小写对不上号也不行，但是其它的所有多语言键值对都可以被使用，只有应用名的这个键值是必须得再`InfoPlist.strings`内才能起作用。  

以上的内容就是我在开发ShareExtension过程中遇到的坑。
