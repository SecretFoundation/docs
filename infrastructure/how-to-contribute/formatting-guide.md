# Style Guide

## Introduction

The Secret Network style guide aims to provide guidance related to the writing and formatting of the Secret Network's documentation.

It records and standardizes documentation styling decisions so contributors can write documentation in accordance with existing documentation.

Thank you in advance for joining us in the process of creating high-quality documentation.

{% hint style="info" %}
The style guide is only a guide, not doctrine. There may be contexts where is makes sense to do things differently from what our style guide suggests to make your contributions better.
{% endhint %}

## Objectives

There are three primary objectives of the Style Guide:

1. To provide a guide for the creation of consistent written communications across the Secret Network ecosystem
2. A review of the Style Guide at least once a year to ensure it reflects modern practices and is suitable for its purpose, and to be updated on an as-needed basis.
3. The style guide review process will accept proposals from the community who disagree with existing guidelines, and Secret Labs will act as an arbiter in those cases.

### What the style guide does not include

The guide does not describe exactly how to write. It aims to help community members write correctly, and encourage consistency across all parts of the Secret Network documentation.

## Tone and content

### Be natural, friendly, and conversational

Software documentation should be written in a conversational, friendly, and respectful tone. Try and use a natural and approachable tone when writing, do not be pushy or pedantic.

### Avoid adding content about future features and products

The documentation should be practical. There is no use in writing documentation regarding future features, products, or innovations before they are officially released. For example, avoid writing sentences like 'We are currently considering adding \<future product feature> '.

### Readability

The readability of the Secret Network documentation should be high. Here are some general guidelines to help improve the readability of your documentation writing:

1. Start paragraphs with key information to improve the scannability of the documentation. More information about the important of scannability for a better UX can be found [here](https://www.uxmatters.com/mt/archives/2015/06/scannability-principle-and-practice.php).
2. Avoid writing long paragraphs. Break up paragraphs using line breaks, headings, and lists.
3. Try to write concisely. Sentences over 30 words should be avoided if possible to avoid writing very hard to read and complex sentences.
4. Define abbreviations and acronyms when they are first used to avoid confusion.
5. Use similar writing structures for similar things, like items in lists and tables.

### Writing for developers around the world

Although the Secret Network documentation is written in US English, it's important to write for a worldwide developer audience. Many developers speak English as a second language and/or use machine translations to read software documentation. Use the following writing tips to produce better writing for developers around the world:

1. Always provide context. Don't assume readers intuitively know what you are writing about.
2. Focus on explaining to readers what they can do, and not what they can't do.
3. Write in an active voice and avoid writing in passive voice. Using passive voice can confuse who is supposed to do what.
4. Directly address readers by using terms like _you_ or _your_ instead of _they_ or _user._
5. Avoid the use of words that can mean multiple things and use specific terminology.

### Page titles and headings

Page titles should use title case, and headings within pages should use sentence case.

#### Page titles

Example of title case for page titles:

* Guide to Using the SecretCLI

#### Headings

Example of sentence case for page headings:

* Privacy preserving smart contract introduction

### Fonts

The use of different styles of fonts should follow the same style guide in use by Google's developer documentation.

* For command-line inputs and outputs, and references to the names of code entities (variables, types, etc...) use `code font`.
* To show where readers should swap in an implementation-specific detail, or name of a sever, in a coding and syntax examples use _`italic code font`_.
* **Bold font** can be used for emphasis, directory names, error messages, and the name of UI elements.
* Italic font can be used when introducing terms for the first time.

## Grammar

### Abbreviations, contractions, and acronyms

#### General rule

Full stops and spaces between letters should not be used after all abbreviations, contractions, and acronyms.

#### Abbreviations

Abbreviations are made when letters are intentionally omitted from the end of words.

* Decentralized applications --> Dapps
* Ethereum --> Eth
* Address --> Addy
* Multi-signature --> Multi-sig
* Market capitalization --> Mcap
* Lamborghini --> Lambo

#### Contractions

Contractions are made when letters are intentionally omitted from the middle of words.

* Transaction -> Tx
* Unspent transaction -> Utxo
* Wrecked -> Rekt
* [Satoshis](https://www.investopedia.com/terms/s/satoshi.asp) -> Sats

#### Acronyms

Acronyms are made from the initial letter of a sequence of words and should be written with a single string of upper-case letters.

* Software Guard Extensions -> SGX
* Central Processing Units -> CPUs
* Software Development Kit -> SDK
* Trusted Execution Environment -> TEE

### Capitalization

In general, capital letters should **not** be used unless absolutely required.

### Numbers

Whole numbers should be written/spelled out between one to ten, and figures should be used for numbers above 10. For example, the number five should be spelled out and the number 55 should be number symbols.

* [x] There are five new Secret Agents.
* [x] Ten Secret Agents have started today's tasks.
* [x] Secret Agents can earn 55 SCRT for today's tasks.
* [x] There were 100 Secret Agents who completed today's tasks.

For large round numbers, a combination of figures and words can be used with abbreviations.

* [x] There are 1 billion privacy violations every day.
* [x] There are 1bn privacy violations every day.
* [x] The Secret Agent budget is $1 million.
* [x] The Secret Agent budget is $1m.

Words like first, second, and so on up to tenth should be spelled out. Any numbers above the tenth should use st/nd/rd/th.

* [x] The first to fourth Secret Agents to complete the task today will earn 10 extra SCRT.
* [x] The 11th to 23rd Secret Agents to complete the task today will earn 5 extra SCRT.

### Punctuation

Punctuation should be used sparingly while maintaining the intended meaning of sentences.

#### Brackets

The use of brackets should be punctuated outside of the brackets and not within the brackets. For example,

* [x] When writing with brackets looks like this (the period goes after the brackets).
* [x] Punctuation should not be used within brackets (do not use periods within brackets like this.)

#### Bullet Points

Bullet points should not end with punctuation like periods or commas. However, when bullet points form complete sentences with the preceding text (or are complete sentence on their own), a full stop (period) should be used.

**No punctuation needed**

For example, below is an example of using bullet points without the need to add punctuation to the end --> Projects built on the Secret Network include:

* Shade Protocol
* Altermail
* Blackbox
* SecretSwap

**Punctuation needed**

The following is an example of when to use punctuation to end bullet points --> If wallet A sends 100 sSCRT to wallet B this will happen:

* Block explorer denotes that wallet A interacted with the sSCRT smart contract (It is not known whether this was a send, buy of NFT, viewing key etc. Amount of tokens is also unknown).
* Wallet B will NOT have an interaction listed on chain (aka on the block explorer).
* Wallet B can use their viewing key to decrypt the receiving transaction so will see the address of the sender and the amount they got.
