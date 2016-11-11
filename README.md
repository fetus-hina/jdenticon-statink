jdenticon-statink
=================

[Jdenticon](https://jdenticon.com/)を使ってサーバ側でidenticonの画像(SVG/PNG)を生成します。

Requirement
-----------

- Node.js 7 (Maybe work with ver. 6)
- Reverse proxy server (e.g. Varnish)

Tested with CentOS 7.2.

Set up
------

1. 適当なところに `$ git clone` します(レポジトリに含まれているファイルは `/home/jdenticon-statink/jdenticon-statink` に clone される前提になっていますが何でもかまいません)
1. `$ npm install` します。
1. "jdenticon-statink.service" を `/etc/systemd/system/` にコピーします(systemdを使っている場合。その他のシステムの場合は中身を見て適当に理解してください)
1. コピーした `/etc/systemd/system/jdenticon-statink.service` を開き、`User`, `Group`, `WorkingDirectory` あたりを正しい感じに変更します。
1. `$ sudo systemctl daemon-reload`
1. `$ sudo systemctl start jdenticon-statink.service`
1. うまくいけば `0.0.0.0:9801` で HTTP サーバが待ち受けるので、この前段にリバースプロキシを挟むなどしてキャッシュを効くようにしてください（オプション）
1. うまくいけば `http://example.com/<ここに16進数>.svg` とか `---.png` とかにアクセスするとそれなりに表示されます。

Attention
---------

- 特にPNGを指定すると割と重いので、複数回アクセスされる場合はリバースプロキシでキャッシュする方がいいと思いますしその前提になっています。

License
-------

MIT License.

Copyright (C) 2016 AIZAWA Hina.
