#!/bin/bash

if [ -z "$1" ];then
	echo "USAGE: $0 file-or-folder-to-encrypt"
	echo "USAGE: $0 file-to-decrypt.tgz.gpg"
	exit 1
fi

INPUT="$1"
ORIGINAL_NAME="`echo $INPUT|sed 's/\..*//'`"
ENCRYPTED_NAME=$ORIGINAL_NAME".tgz.gpg"

SECRET=`./password-generator.sh "$ENCRYPTED_NAME"`

if [[ "$INPUT" == *".tgz.gpg" ]];then
	gpg -d --batch --passphrase "$SECRET" "$ENCRYPTED_NAME"|tar xz
else
	tar cz "$ORIGINAL_NAME"|gpg -c --batch --passphrase "$SECRET" -o "$ENCRYPTED_NAME"
fi

