# PaperPress
PaperPress is a node.js tool that can make static page-based blogs simply, with using Markdown, through a free website deploying service, [surge](https://surge.sh/). You can write posts instantly and make deploy blog by using PaperPress.


> **Knowing further**
> * <a id="paper-press-sel-1" href="#paper-press-help-1">About static page-based blog</a>
> * <a id="paper-press-sel-2" href="#paper-press-help-2">Setting the custom domain</a>
> * <a id="paper-press-sel-3" href="#paper-press-help-3">Deleting a blog</a>

> **Other language of this document**
> * [한국어](https://github.com/seokju-na/paper-press/blob/master/docs/Korean.md)


## Features

<p align="center"><a href="https://youtu.be/DX-QX4aliJQ">Watch Introduce Video</a></p>


[![img](https://github.com/seokju-na/paper-press/blob/master/docs/imgs/Video.png)](https://youtu.be/DX-QX4aliJQ)


* You can concentrate fully on writing without having to consider problems like setting server or installing databases.
* Use markdown for fast and easy way to publish posts with stylish layouts.
* All posts in a blog is saved in a markdown file format(.md)
* A blog is created through [surge](https://surge.sh/) in your domain when deployed.



## Get Started

PaperPress is a node.js module that can be downloaded by using [npm](https://www.npmjs.com/). npm is automatically installed when installing node.js (If you didn't install npm, you cna install via [Install node.js](https://nodejs.org/ko/))



#### 1. Install dependencies module

```shell
$ npm install -g gulp-cli
$ npm install -g surge
```

#### 2. Logging in at [surge](https://surge.sh)

```shell
$ surge login
```

Enter your account and password when logging in at surge. Refer to [Getting started with Surge](https://surge.sh/help/getting-started-with-surge) for more information.


#### 3. Install PaperPress

```shell
$ npm install -g paper-press
```

#### 4. Run PaperPress

```shell
$ paper-press
```

Enter config settings at the first run to make blog set-up files. The needed items are as follows.


* **Blog Name**
Enter the name of blog to be exposed on the blog.

* **Author Name**
Enter the your name to be exposed on the blog.

* **Author's Email**
Enter the your email to be exposed on the blog.

* **Facebook Account ID**
You can find your facebook ID in the profile page of your facebook account. For example, at the profile page ``https://facebook.com/example``, ``example`` is the ID of your facebook account.
When you don't have a facebook account, skip the question by clicking <kbd>Enter</kbd>.

* **Twitter Account ID**
When you don't have a twitter account, skip the question by clicking <kbd>Enter</kbd>.

* **Github Account Username**
You can find your username in the profile page of your github account. For example, at the profile page ``https://github.com/example``, ``example`` is the username of your github account.
When you don't have a github account, skip the question by clicking <kbd>Enter</kbd>.

* **Disqus URL**
Access at [disqus](https://publishers.disqus.com/) and create disqus plugin by clicking ``Install on Your Site``. Enter the unique name of Disqus URL. For example if your Disqus URL is ``example.disqus.com``, enter ``example``.

* **Blog Template**
Choose the template. When entering blank it is set up ad ``default`` template.

* **Domain**
Setup the domain of blog. PaperPress using [surge](https://surge.sh/) as CDN, so the format of blog domain has to be like ``exmaple.surge.sh``. Refer to <a href="#paper-press-help-2">Setting the custom domain</a> to setup the custom domain.



After entering all items, the entered setting, through ``src/blog.config.json`` path, a setup file is created in JSON file format.

When blog setup file is created, you can write by accessing [http://127.0.0.1:8888](http://127.0.0.1:8888)



## License

MIT License



## To know further

#### <a id="paper-press-help-1" href="#paper-press-sel-1">About static page-based blog</a>

Static page-based blog refers to a blog that is has all pages consisted in the blog in HTML so that it only shows completed pages, instead of making and composing pages through a server.

#### <a id="paper-press-help-2" href="#paper-press-sel-2">Setting the custom domain</a>

You can add custom domain for free by using surge. Refer to [Adding a custom domain](https://surge.sh/help/adding-a-custom-domain) for more information.

#### <a id="paper-press-help-3" href="#paper-press-sel-3">Deleting a blog</a>

Delete a blog by using surge. If the name of your domain is ``example.surge.sh``, enter the order as follows:
```shell
$ surge teardown example.surge.sh
```
Refer to [Tearing down a published project](https://surge.sh/help/tearing-down-a-project)



