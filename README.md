# Password generator

You can find this tool
[online](https://lent.ink/projects/pwd/)
and as a
[chrome extension](https://chrome.google.com/webstore/detail/password-generator/jfifacfjklgckibildbhokcaknpgjgaf)

## Installation of Chrome extension using source code

THIS IS NOT NEEDED, see link above.

How to install this unpacked chrome extension:
+ download the files in the folder `chrome-extension` ([link to zip](https://lent.ink/projects/pwd/pass-gen-chrome-ext.zip)
+ unzip the archive
+ go to `chrome://extensions`
+ enable developers mode (top right)
+ click on 'Load Unpacked' (top left)
+ now select the unzipped folder

The chrome-extension should now be installed.

## Is it secure?

- Unique password for every website (domain), preventing reuse attacks
- No hassle of secure backup of your passwords

The hash generated gives you up to 160bit password strength,
depending on the passphrase.
Passwords are unique for every website,
since the domain is used in the hash.

You could have multiple passphrases,
e.g. one for all work related, one for social media etc.

NOTE: some websites have a max length on a password,
resulting in lower possible strenght.
Services demanding a short password could indicate bad security.

## How does it work?

_Found out later that [lesspass](http://lesspass.com) does the similar thing._
_but requires more parameters and does not come preinstalled_ (`shasum`).

It is inspired by [Stanford PwdHash](https://pwdhash.github.io/website/)
and works by doing
`base58( shasum(apex.tld + PASSPHRASE) )`

It is a concatenation of the domain you want a password for,
together with a phrase that you use.
This string is then used to calculate a hash.
This hash uses base16 or
[hexadecimal](https://stackoverflow.com/questions/12618321/what-pool-of-characters-do-md5-and-sha-have)
resulting in 40 characters, which we convert to base58 (27/28 characters).

## Technical

Since multiple websites have a upperlimit of 32 characters for a password,
this tool now only supports 30 character (160bit) passwords.

We do two SHA rounds, preventing
[brute force](https://crypto.stackexchange.com/questions/47177/would-sha1-be-broken-by-sheer-brute-force-even-if-it-had-no-weaknesses-of-its-o)
searching for the master passphrase (not needed atm. but makes it future proof).

The first round (`sha512sum`) to prevent an offline attack when 1 or more passwords are leaked
and the second round (`sha1sum`) to have 40 characters base16, which we convert to base58, resulting in 27/28 characters.
```shell
echo -n "`echo -n 'apex.tldPASSPHRASE' \
  | sha512sum \
  | tr -d '\n -' \
  | sha1sum \
  | cut -f1 -d' ' \
  | xxd -r -p \
  | base58`-_"
# or on one line
 echo -n 'apex.tldPASSPHRASE'|sha512sum|tr -d '\n -'|sha1sum|cut -f1 -d' '|xxd -r -p|base58
```
(to avoid storing `history`, prepend a space to `echo`)

This provides us with 27/28 chars, which we postfix with `-_` (hyphen underscore).
We do this at the end so when a website does not allow these special chars,
you can hit backspace after pasting and create a mnemonic
(e.g. `28-2` or `12-2` i.e. `12` minus `2` special chars).


### Padding
We tested this with 1M records
```shell
for i in {1..1000000};do echo -n $i|shasum|xxd -r -p|base64;done
```
and found out that 9858 have no number [0-9],
0 have no letter [a-z]
and 2 have no capital letter [A-Z].
To be sure that all three type of characters are present,
we append
```shell
|grep [0-9]|grep [A-Z]|grep [a-z]
```
to our initial command.
If we now get no output (probability of 1%),
we know one of the character types was missing.
We solve this by prepending a 'p' (referring to padding)
to our initial input, giving us 'apex.tldPASSPHRASE**p**'.

But don't worry, the tool does this for you,
it's just to explain the inner working of this tool.

### Short, 12 character password
Some services have a password limit,
ranging from acceptable (e.g. 32 at digid.nl or namesilo.com)
to short (e.g. 20 at paypal.com and 16 at microsoftonline.com).

When 28 chars. is too long,
we reduce it to 12, which should always fit.
The same padding technique applies here,
making it occur more often for shorter passwords.

To achieve this on your terminal,
just append
```shell
|cut -c1-12
```
to the command.


## What about a password manager?
The motivation for this password manager was the backup requirement
of normal password managers,
which need to be done secure.
One colleague of mine once had his password manager report that the file was corrupted,
resulting in the lost of all his passwords,
thus the backup should also have versioning.

This solution does not have this requirement,
you just remember the master passphrase(s).

Disadvantages compared to password manager;
- When your secret sentence is compromised,
one could generate all your passwords
(the same goes for your password on your online password manager)
- Your sentence unlocks the power to generate all your passwords,
also the passwords for not yet existing services
(not sure if this is an issue)
- password managers provide a list of all your services
(with this tool you should keep a list for yourself/heirs)
- This password mechanism allows one to generate them on the terminal
and other insecure places, which could be a risk
- Just like a regular password manager that generates random passwords,
the password cannot be memorized
- This system allows you to use multiple master passwords (e.g. social, work, finance, team1, team2 etc.)
however, for teams, this would result in more password rotations.

Other disadvantages;
- A key based hash (HMAC) or slow hash (Argon2, [S|B]crypt, PBKDF2)
would make this system more secure,
however,`shasum` was chosen,
since it comes pre-installed on most machines

## Old version

Generated a password in the past?
The first version using prefix can be found
[here](https://lent.ink/projects/pwd/v1.html)
and the source code using base64
[here](https://github.com/svlentink/password-generator/tree/f492b3243caed3e7dc5cb5266f4c1b8af3d261b5).

Or if you used a
[s](https://chrome.google.com/webstore/detail/password-generator/nnjgaeekiplalipomfgacalgehhcckbp)
i
[m](https://chrome.google.com/webstore/detail/passcodes/pjgdijdkpgkjcbmedadeohddhlngeege)
[i](https://chrome.google.com/webstore/detail/onepass-password-manager/emeedobobbobllpippjidhpiigoffbbj)
[l](https://chrome.google.com/webstore/detail/masterpassword-for-chrome/hifbblnjfcimjnlhibannjoclibgedmd)
a
[r](https://chrome.google.com/webstore/detail/password-generator/klfojgipmkdgfmikjfdhhkjlfeboaoij)
app.
