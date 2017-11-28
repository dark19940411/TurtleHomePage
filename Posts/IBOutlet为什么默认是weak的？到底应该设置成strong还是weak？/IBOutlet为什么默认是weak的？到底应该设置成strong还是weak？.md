---
title: IBOutlet为什么默认是weak的？到底应该设置成strong还是weak？
date: 2016-12-07 11:50:59
tags:
---
这个问题困扰了我许久了，于是今天我决定终结这个疑惑。  
我谷歌了一下这个问题，于是在stackOverflow上看到了不同的答案，其中一个回答是说WWDC2015中的一个视频“Implementing UI Designs in Interface Builder”里的Apple工程师是这么说的：  

>And the last option I want to point out is the storage type, which can either be strong or weak. In general you should make your outlet strong, especially if you are connecting an outlet to a subview or to a constraint that's not always going to be retained by the view hierarchy. The only time you really need to make an outlet weak is if you have a custom view that references something back up the view hierarchy and in general that's not recommended.  

大意就是一般来说你应该将outlet设为strong的，尤其是你在向一个不总会被视图层级所retained的子视图或者自动布局约束连接outlet的时候，你更应该将它设置为outlet。唯一需要将outlet设置为weak的时候就是你有一个自定义视图反向引用了视图层级的时候。  
所以意思是，outlet一般推荐使用strong。  

然后我又跑去看了[官方Nib Files的文档](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/LoadingResources/CocoaNibs/CocoaNibs.html#//apple_ref/doc/uid/10000051i-CH4-SW6),上面是这么说的：
>From a practical perspective, in iOS and OS X outlets should be defined as declared properties. Outlets should generally be weak, except for those from File’s Owner to top-level objects in a nib file (or, in iOS, a storyboard scene) which should be strong. Outlets that you create should therefore typically be weak, because:

>* Outlets that you create to subviews of a view controller’s view or a window controller’s window, for example, are arbitrary references between objects that do not imply ownership.  


>* The strong outlets are frequently specified by framework classes (for example, UIViewController’s view outlet, or NSWindowController’s window outlet).  

总结起来就是，一般来说load nib file获取到的对象都推荐使用弱引用，除了顶层的对象，因为没有父对象进行持有，所以不使用强引用进行持有的话，这时候outlet就会释放。  
所以苹果工程师建议用strong，官方文档建议用weak？  
什么鬼？？？  
![](/images/黑人问号.png)  

但是其实上面两段话并不冲突，苹果工程师认为视图层级不能长久持有某个子视图而推荐使用strong。但是官方文档给出的第一个原因也很好地解释了这个问题，**“由于outlet之间的引用是随意的，并没有暗示outlet和对象之间的从属关系。”**  举个简单的例子，假如我有一个customView内部有对controllerA的强引用，这时候我们再将这个customView的outlet拉到controllerA上，那么假如这个outlet是strong的话，是不是就循环引用了？是的。正是如此，为了防止这种情况的出现，所以苹果推荐outlet都使用weak引用。  

不过，看完这段话，我有了几个疑问：
* 假定我的outlet是一个subview，我拖向了它所在的视图控制器，如果不是强引用的话，它被谁持有了呢？为什么在控制器使用它的时候没被释放？
* 什么是顶层对象？为什么顶层对象要用strong？
* 从上面我们可以知道outlet是可以为strong的，只是不推荐。那有什么时候outlet一定是要用weak的吗？
***
先来看第一个问题。  
简单来说，这个weak的outlet其实是被视图层级（view hierarchy）所持有了。那什么是视图层级呢？让我们来看一种常见情况——假如你在viewDidLoad方法的作用域里创建里一个临时变量view，然后将它addSubview，等到方法执行结束后，却依然可以在对应的视图里看到这个view。这是为什么呢？唯一引用了这个view的临时变量不是被释放了吗？这个view对象不也应该被释放掉才对吗？
不不不，这时候，正是视图层级（view hierarchy）对它进行了引用。看了[官方文档解释view hierarchy](https://developer.apple.com/library/content/documentation/General/Conceptual/Devpedia-CocoaApp/View%20Hierarchy.html)我们知道view hierarchy其实就是苹果将window和其下的子视图整合成的一颗颠倒树形结构。构建它的原因官方文档并没有说（但是其实估计就是为了保证视图们在屏幕上的显示吧，免得出现明明add了subview却被释放了而无法正常显示的情况）。  
视图层级示意图：  
![](/images/view_hierarchy_enclose.jpg)  
视图层级引用链：Controller.view.subviews.subviews.......以此类推
***
再来看第二个问题。  
从官方文档里我们知道了，顶层对象通常在框架里出现。比如UIViewController所对应的view，那这个view就属于顶层对象，由于它除了controller以外没有父对象进行引用，所以它对应的outlet就应该是strong的。  
基于这一点，我做了一些思考，觉得还有另外一种可能会产生出顶层对象，那按照这个套路，我自己也做了一个小实验——制造顶层对象。接下来请紧跟我的步伐：
1. 创建一个工程
2. 创建一个叫Model的类
3. 往Storyboard的首个ViewController拖入一个Object，将它的类设为Model（讲道理，这个Object应该就是一个顶层对象了，因为假如拖outlet到controller上的话，就只有controller作为它的父对象，因为view hierarchy也不会对这种非视图类进行引用。所以这就是一个顶层对象了是吧？好，初步认为它是，我们接着往下进行实验。）
4. 拉一个Model对象的weak的outlet到controller上
5. 在-viewDidLoad和-viewDidAppear里打出model的信息。
6. 运行程序  

让我们来看看结果：  
![](/images/littleExperimentsResult.png)  
So[冷漠脸], What the f\*\*k is that? 讲道理这个outlet不是应该一初始化就会被释放了吗？为什么？？？无法理解啊  
而在拖取这个outlet的时候默认引用属性也像意料之中的变成了strong，但是为什么结果却是这样子的啊？
好吧，到了这里我已经没辙了。我这个model并不是一个视图型的对象，所以它必然不会被视图层级引用，因此它理应只会被controller所引用啊。而在我仅在controller内设置了一个weak的model的outlet情况下，model竟然还是不会释放。对于这个问题，我并不想再深究下去，有兴趣的人可以继续挖掘。我认为的原因是——**在controller从storyboard里生成的时候，系统会以runtime的形式创建它的属性并将强引用绑定到controller上，以此防止神奇的开发者将顶层对象的弱引用拖入到controller时而出乎意料的释放。**（这一段话都挺绕的，希望你有看懂）  
***
最后第三个问题。  
**猜想：** 接上一个问题的实验。我们都知道ViewController里有一个Model对象了，假如Model里面有一个对ViewController的强引用（危险动作，请勿模仿），那这个Model在ViewController里的引用就必须是弱引用，否则就会引起循环引用而内存泄漏了。  
然而事实真的是这样吗？为了解决我的这个疑问，我又做了一个小实验。  
**实验：** 我在Model类里设置了一个ViewController的strong property。然后再在StoryBoard里拖入一个新的RootViewController用来present起ViewController，然后给ViewController也加了一个button用来dismiss掉ViewController（因为只有这样，系统才会去回收ViewController对象实体）。然后拖一个weak的Model的outlet到controller里。这时候打开Profile（Instruments)里的Leaks运行程序，等到ViewController被present起来后点击button将它dismiss。这时候，我们就会**惊奇**地发现内存泄漏了？！  
weak的modelOutlet的内存泄漏情况(两个model，是因为我dismiss了ViewController两次)：  
![](/images/weak版outlet内存泄漏.png)  
然后我们将IBOutlet的引用改成strong的再次执行同样的操作，可以看到内存还是泄漏了。  
![](/images/strong outlet内存泄漏.png)  
再来看看outlet为weak时，model泄漏时，它的retain/release情况：  
![](/images/outlet有leaks的log.png)  
我们可以看到，在viewDidAppear以后，它还是保持着1的引用计数。为什么？不应该吧，outlet是weak啊，还有谁能引用它？（接下来是一段没有证据的猜测）那就只能是controller引用了它。意思就是尽管你是weak的outlet，UIKit在用storyBoard初始化ViewController的时候，还是会持有model，这就很奇怪了，感觉和设计的原意不符，但是用instruments来跟踪的结果，似乎就是这样。
所以，无论你是用强引用的outlet，还是弱引用的outlet，这种情况下都会内存泄漏。而这一点就恰恰证明了我在第二个问题时的猜测——**在controller从storyboard里生成的时候，系统会以runtime的形式创建它的属性并将强引用绑定到controller上，以此防止神奇的开发者将顶层对象的弱引用拖入到controller时而出乎意料的释放。**  
### 怪！！！！  
到这里，感觉很不爽，挖了很多的坑但是都没有好好的填好。但是至少证明了一件事情，使用UIKit默认的Outlet的强弱引用是可行的。我们只要注意高危操作和循环引用就可以了。而我个人的推荐也和苹果的[Nib Files文档](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/LoadingResources/CocoaNibs/CocoaNibs.html#//apple_ref/doc/uid/10000051i-CH4-SW6)一样，正常视图outlet尽量用weak（尽管用strong没问题），顶层对象尽量用strong。而反向的强引用则可以改成更优雅的weak，甚至代理。
