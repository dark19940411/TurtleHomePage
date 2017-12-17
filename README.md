# TurtleHomePage
This repository contains the generator and all resources of my website along with the generated html pages, which are all written by me.  
It has a generator named **Turto** which is inspired by hexo and my nickname. But I didn't implement it in a general way to fit in 
with every template. I start it with my personal purpose, so it can only render my `ejs` template so far. Actually, this whole 
thing is used to generate my blog.   
The generator is settled in `/Turto` directory, and my template is written in `/build/Template`.  
**Turto** is written with `node.js` starting with `main.js` file. It can now surpport three commands:  
`node Turto/main.js g`, `node Turto/main.js c`, `node Turto/main.js n blogTitle`
to generate the web pages, clear the generated results and to create a markdown file that you named it at `Posts` directory.  
# License 
The style of my blog is mainly copy from [Vno - Jekyll](https://github.com/onevcat/vno-jekyll) 
written by [OneV](https://onevcat.com), which is a transformation of [Uno](https://github.com/daleanthony/uno). Great Thanks 
to those people who makes tremendous contribution to these cool things. And I made a bit of changes to the font color, top
 bar and something else. Even though the style merely owns a little parts of this system, but I will still follow 
 [Vno - Jekyll](https://github.com/onevcat/vno-jekyll) and be licensed as 
 [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). See the link for more infomation.
