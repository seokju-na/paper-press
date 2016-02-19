# PaperPress
PaperPress는 마크다운(Markdown)으로 작성한 글들을 무료 웹사이트 배포 서비스인 [surge](https://surge.sh/)를 통해 간편하게 정적 페이지 기반의 블로그를 만들 수 있는 도구입니다. PaperPress를 사용하면 빠르게 글을 작성하고 바로 배포하여 블로그를 만들 수 있습니다.


> **좀 더 알아보기**
> * <a id="paper-press-sel-1" href="#paper-press-help-1">정적 페이지 기반 블로그란?</a>
> * <a id="paper-press-sel-2" href="#paper-press-help-2">커스텀 도메인 설정하기</a>
> * <a id="paper-press-sel-3" href="#paper-press-help-3">블로그 삭제하기</a>

## 특징

<p align="center"><a href="https://youtu.be/2IUwsdlw0to">소개 동영상 보기</a></p>


[![img](https://github.com/seokju-na/paper-press/blob/master/docs/imgs/Video-thumbnail-v1.1.0.png)](https://youtu.be/2IUwsdlw0to)



* 블로그를 만드는데 서버 구성, DB 설치 등을 고민하지 않고 오로지 글 작성에만 집중할 수 있습니다.
* 마크다운(Markdown)으로 빠르고 쉽게 세련된 레이아웃의 글을 발행할 수 있습니다.
* 블로그의 글들은 모두 마크다운 파일 형식(.md)으로 저장됩니다.
* 블로그 배포 시 [surge](https://surge.sh)를 통해 해당 도메인에 블로그가 만들어집니다.


## 시작하기

PaperPress는 node.js 모듈이므로 [npm](https://www.npmjs.com/)을 이용하여 다운받을 수 있습니다. npm은 node.js 설치 시 같이 자동으로 설치됩니다. (npm이 설치 되어 있지 않은 경우, [node.js 설치하기](https://nodejs.org/ko/)에서 설치하실 수 있습니다.)


#### 1. 의존 모듈 설치

```shell
$ npm install -g gulp-cli
$ npm install -g surge
```

#### 2. [surge](https://surge.sh)에 로그인

```shell
$ surge login
```

surge에 로그인 시 자신의 계정과 비밀번호를 입력합니다. 더 자세한 내용은 [Getting started with Surge](https://surge.sh/help/getting-started-with-surge)을 참고하세요.


#### 3. PaperPress 설치

```shell
$ npm install -g paper-press
```

#### 4. PaperPress 실행

```shell
$ paper-press
```


처음 실행 시 블로그 설정 파일을 생성하기 위해 간단한 설정들을 입력합니다. 필요한 설정 항목들은 다음과 같습니다.


* **블로그 이름** - 블로그에 노출할 블로그의 이름을 입력해주세요.

* **저자 이름 (author name)**
블로그에 노출할 자신의 이름을 입력해주세요.

* **저자 이메일 (author email)**
블로그에 노출할 자신의 이메일(email)을 입력해주세요.

* **페이스북 계정 ID**
자신의 페이스북 프로필 페이지의 주소에서 페이스북 계정 ID를 알 수 있습니다. 예를 들어 프로필 페이지 ``https://facebook.com/exmaple``에서 ``exmaple``이 페이스북 계정 ID입니다.
페이스북 계정이 없는 경우 <kbd>Enter</kbd>를 눌러 질문을 넘어갑니다.

* **트위터 계정 ID**
트위터 계정이 없는 경우 <kbd>Enter</kbd>를 눌러 질문을 넘어갑니다.

* **깃허브 계정 이름**
자신의 깃허브 프로필 페이지의 주소에서 깃허브 계정 이름을 알 수 있습니다. 예를 들어 프로필 페이지 ``https://github.com/example``에서 ``example``이 깃허브 계정 이름입니다.
깃허브 계정이 없는 경우 <kbd>Enter</kbd>를 눌러 질문을 넘어갑니다.

* **Disqus URL**
[disqus](https://publishers.disqus.com/)에 접속하여 ``Install on Your Site``를 눌러 Disqus 플러그린을 생성합니다. Disqus URL의 고유한 이름을 입력해주세요. 예를 들어 자신의 Disqus URL이 ``example.disqus.com``인 경우 ``example``을 입력합니다.

* **블로그 템플릿**
사용할 템플릿을 정합니다. 빈칸을 입력하는 경우 ``default`` 템플릿으로 설정됩니다.

* **도메인**
블로그의 도메인을 설정합니다. PaperPress는 [surge](https://surge.sh)를 CDN으로 이용하므로 블로그의 도메인의 형태는 ``example.surge.sh``처럼 이루어져야 합니다. 커스텀 도메인을 설정하는 방법은 <a href="#paper-press-help-2">커스텀 도메인 설정하기</a>을 참고합니다.


항목을 모두 입력 후 설정 내용들이 ``src/blog.config.json`` 경로로 JSON파일의 형식의 설정 파일이 생성됩니다.

블로그 설정 파일이 생성된 후 [http://127.0.0.1:8888](http://127.0.0.1:8888)에 접속하여 글을 작성할 수 있습니다!


## 사용법

#### 실행하기

```shell
$ paper-press
```

명령어 실행 후 [http://127.0.0.1:8888](http://127.0.0.1:8888)에 접속하여 글을 작성하고 블로그를 배포할 수 있습니다.


#### 이미지 폴더 열기

```shell
$ paper-press img
```

블로그에서 사용할 이미지들이 위치한 폴더를 엽니다. 필요한 이미지는 이 폴더안에 넣어 사용합니다.


#### 페이퍼 폴더 열기

```shell
$ paper-press papers
```

블로그의 글들이 저장되어 있는 폴더를 엽니다.


## 라이센스

MIT License



## 좀 더 알아보기

#### <a id="paper-press-help-1" href="#paper-press-sel-1">정적 페이지 기반 블로그</a>

정적 페이지 기반 블로그란 서버 측에서 페이지를 구성하고 만드는 것이 아닌 블로그를 구성하는 모든 페이지를 HTML으로 구성해 이미 완성된 페이지를 보여주기만 하는 블로그를 말합니다.

#### <a id="paper-press-help-2" href="#paper-press-sel-2">커스텀 도메인 설정하기</a>

surge를 이용하여 무료로 커스텀 도메인을 추가할 수 있습니다. 자세한 내용은 [Adding a custom domain](https://surge.sh/help/adding-a-custom-domain)을 참고하세요.

#### <a id="paper-press-help-3" href="#paper-press-sel-3">블로그 삭제하기</a>

surge를 이용하여 블로그를 삭제합니다. 만약 자신의 도메인 이름이 ``example.surge.sh``인 경우 다음과 같이 명령어를 입력합니다.
```shell
$ surge teardown example.surge.sh
```
더 자세한 내용은 [Tearing down a published project](https://surge.sh/help/tearing-down-a-project)을 참고합니다.



