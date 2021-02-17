#!/bin/sh

if [ "$1" = "-s" ]; then
	USING_SHORT=1
	shift
fi

APEX="$1"
shift
if [ -z "$APEX" ]; then
	echo "USAGE: $0 [-s] apex.tld"
	exit 1
fi

if [ -n "$1" ]; then
	PASSPHRASE="$1"
	shift
else
	read -p "Please enter your secret phrase between quotes:" PASSPHRASE
fi

get_hash() {
	INPUT="$1"
	initial=`echo -n "$INPUT" \
		| sha512sum \
		| tr -d '\n -' \
		| sha1sum \
		| cut -f1 -d' ' \
		| xxd -r -p \
		| base64`
	if [ "$USING_SHORT" = 1 ]; then
		h=`echo -n $initial|cut -c17-28`
	else
		h="$initial"
	fi

	echo -n $h|grep [0-9]|grep [A-Z]|grep [a-z]
}

INPUT="$APEX$PASSPHRASE"
while true; do
	h=`get_hash "$INPUT"`
	if [ -n "$h" ]; then
		echo -n $h
		exit 0
	else
		#echo "INFO applied padding"
		INPUT=$INPUT"p"
	fi
done


