#!/bin/sh

cp ./chrome-extension/* ./public/
cd public
mv pwdgen.htm index.html
sed -i 's/<!--include-in-webversion//g' index.html
sed -i 's/include-in-webversion-->//g' index.html
cd ..
zip -r pass-gen-chrome-ext.zip chrome-extension
