#!/bin/sh

cp ./chrome-extension/* ./public/
cd public
mv pwdgen.htm index.html
sed -i 's/<!--insert-h1-here-->/<h1>Password generator<\/h1>/g' index.html
zip -r pass-gen-chrome-ext.zip ./chrome-extension
