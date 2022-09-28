# Style Guide

## Introduction&#x20;

The Secret Network style guide aims to provide guidance related to the writing and formatting of the Secret Network's documentation.&#x20;

It records and standardizes documentation styling decisions so contributors can write documentation in accordance with existing documentation.&#x20;

Thank you in advance for joining us in the process of creating high-quality documentation.&#x20;

{% hint style="info" %}
The style guide is only a guide, not doctrine. There may be contexts where is makes sense to do things differently from what our style guide suggests to make your contributions better.&#x20;
{% endhint %}

## Objectives

There are three primary objectives of the Style Guide:&#x20;

1. To provide a guide for the creation of consistent written communications across the Secret Network ecosystem
2. A review of the Style Guide at least once a year to ensure it reflects modern practices and is suitable for its purpose, and to be updated on an as-needed basis.&#x20;
3. The style guide review process will accept proposals from the community who disagree with existing guidelines, and Secret Labs will act as an arbiter in those cases.&#x20;

### What the style guide does not include

The guide does not describe exactly how to write. It aims to help community members write correctly, and encourage consistency across all parts of the Secret Network documentation.&#x20;

## Tone and content&#x20;

### Be natural, friendly, and conversational

Software documentation should be written in a conversational, friendly, and respectful tone. Try and use a natural and approachable tone when writing, do not be pushy or pedantic.&#x20;

### Avoid adding content about future features and products&#x20;

The documentation should be practical. There is no use in writing documentation regarding future features, products, or innovations before they are officially released. For example, avoid writing sentences like 'We are currently considering adding \<future product feature> '.&#x20;

### Readability

The readability of the Secret Network documentation should be high. Here are some general guidelines to help improve the readability of your documentation writing:&#x20;

1. Start paragraphs with key information to improve the scannability of the documentation. More information about the important of scannability for a better UX can be found [here](https://www.uxmatters.com/mt/archives/2015/06/scannability-principle-and-practice.php).&#x20;
2. Avoid writing long paragraphs. Break up paragraphs using line breaks, headings, and lists.&#x20;
3. Try to write concisely. Sentences over 30 words should be avoided if possible to avoid writing very hard to read and complex sentences.&#x20;
4. Define abbreviations and acronyms when they are first used to avoid confusion.
5. Use similar writing structures for similar things, like items in lists and tables.&#x20;

### Writing for developers around the world

Although the Secret Network documentation is written in US English, it's important to write for a worldwide developer audience. Many developers speak English as a second language and/or use machine translations to read software documentation. Use the following writing tips to produce better writing for developers around the world:&#x20;

1. Always provide context. Don't assume readers intuitively know what you are writing about.&#x20;
2. Focus on explaining to readers what they can do, and not what they can't do.&#x20;
3. Write in an active voice and avoid writing in passive voice. Using passive voice can confuse who is supposed to do what.&#x20;
4. Directly address readers by using terms like _you_ or _your_ instead of _they_ or _user._&#x20;
5. Avoid the use of words that can mean multiple things and use specific terminology.&#x20;

### Page titles and headings&#x20;

Page titles should use title case, and headings within pages should use sentence case.&#x20;

#### Page titles

Example of title case for page titles:

* Guide to Using the SecretCLI

#### Headings

Example of sentence case for page headings:&#x20;

* Privacy preserving smart contract introduction

### Fonts

The use of different styles of fonts should follow the same style guide in use by Google's developer documentation.&#x20;

* For command-line inputs and outputs, and references to the names of code entities (variables, types, etc...) use `code font`.&#x20;
* To show where readers should swap in an implementation-specific detail, or name of a sever, in a coding and syntax examples use _`italic code font`_.&#x20;
* **Bold font** can be used for emphasis, directory names, error messages, and the name of UI elements.&#x20;
* Italic font can be used when introducing terms for the first time.&#x20;

## Grammar&#x20;

### Abbreviations, contractions, and acronyms

#### General rule

Full stops and spaces between letters should not be used after all abbreviations, contractions, and acronyms.&#x20;

#### Abbreviations

Abbreviations are made when letters are intentionally omitted from the end of words.&#x20;

* Decentralized applications --> Dapps
* Ethereum --> Eth
* Address --> Addy
* Multi-signature --> Multi-sig
* Market capitalization --> Mcap
* Lamborghini --> Lambo

#### Contractions

Contractions are made when letters are intentionally omitted from the middle of words.&#x20;

* Transaction -> Tx
* Unspent transaction --> Utxo
* Wrecked --> Rekt
* [Satoshis](https://www.investopedia.com/terms/s/satoshi.asp) --> Sats

#### Acronyms

Acronyms are made from the initial letter of a sequence of words and should be written with a single string of upper-case letters.&#x20;

* Software Guard Extensions --> SGX
* Central Processing Units --> CPUs
* Software Development Kit --> SDK
* Trusted Execution Environment --> TEE

### Capitalization&#x20;

In general, capital letters should **not** be used unless absolutely required.&#x20;

### Numbers

Whole numbers should be written/spelled out between one to ten, and figures should be used for numbers above 10. For example, the number five should be spelled out and the number 55 should be number symbols.&#x20;

* [x] There are five new Secret Agents.&#x20;
* [x] Ten Secret Agents have started today's tasks.&#x20;
* [x] Secret Agents can earn 55 SCRT for today's tasks. &#x20;
* [x] There were 100 Secret Agents who completed today's tasks.&#x20;

For large round numbers, a combination of figures and words can be used with abbreviations.&#x20;

* [x] There are 1 billion privacy violations every day.&#x20;
* [x] There are 1bn privacy violations every day.&#x20;
* [x] The Secret Agent budget is $1 million.&#x20;
* [x] The Secret Agent budget is $1m.&#x20;

Words like first, second, and so on up to tenth should be spelled out. Any numbers above the tenth should use st/nd/rd/th.&#x20;

* [x] The first to fourth Secret Agents to complete the task today will earn 10 extra SCRT.&#x20;
* [x] The 11th to 23rd Secret Agents to complete the task today will earn 5 extra SCRT.&#x20;

### Punctuation&#x20;

Punctuation should be used sparingly while maintaining the intended meaning of sentences.&#x20;

#### Brackets

The use of brackets should be punctuated outside of the brackets and not within the brackets. For example,&#x20;

* [x] When writing with brackets looks like this (the period goes after the brackets).&#x20;
* [x] Punctuation should not be used within brackets (do not use periods within brackets like this.)

#### Bullet Points

Bullet points should not end with punctuation like periods or commas. However, when bullet points form complete sentences with the preceding text (or are complete sentence on their own), a full stop (period) should be used.&#x20;

**No punctuation needed**&#x20;

For example, below is an example of using bullet points without the need to add punctuation to the end --> Projects built on the Secret Network include:&#x20;

* Shade Protocol
* Altermail
* Blackbox&#x20;
* SecretSwap

**Punctuation needed**&#x20;

The following is an example of when to use punctuation to end bullet points --> If wallet A sends 100 sSCRT to wallet B this will happen:

* Block explorer denotes that wallet A interacted with the sSCRT smart contract (It is not known whether this was a send, buy of NFT, viewing key etc. Amount of tokens is also unknown).
* Wallet B will NOT have an interaction listed on chain (aka on the block explorer).
* Wallet B can use their viewing key to decrypt the receiving transaction so will see the address of the sender and the amount they got.&#x20;



