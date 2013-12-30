# TL;DR

## Because you write too much

Support this plugin by contributing to my [GitTip fund](https://www.gittip.com/ttscoff/).

TL;DR scans for headlines in a block of content and creates a "TL;DR" element at the top with the headline and a summary generated either from a data-tldr attribute on the headline or from the beginning text of the following elements.

You can control the length of the summary, the conditions that trigger the creation of the TL;DR block and take control of the markup it outputs. TL;DR doesn't do any styling, but it provides markup that's easy to work with.

### Basic usage

	$('.perm .instapaper_body').tldr();

This will generate a TL;DR block at the beginning of the element with the class '.instapaper_body' based on the contents of that element. It will use the default settings (described below):

	headlineElements: 'h2,h3', 
	target: '', 
	wrapper: '<div class=tldr-wrapper>', 
	listType: 'ol', 
	headlineTag: 'strong', 
	headerTag: 'h4', 
	headerTitle: 'TL;DR', 
	dataAttribute: 'tldr', 
	collapsed: false, 
		addClickHandler: true, 
		accordion: true, 
	insertAfterLead: false, 
	grafsInSummary: 1, 
	sentencesPerGraf: 1, 
	maxSummaryLength: 200, 
	minimumHeadlines: 3, 
	useMetaDescription: true 

### Customized usage

	$('.perm .instapaper_body').tldr({
		headerTag: 'h4 class=blocktitle',
		headerTitle: '&#9660; TL;DR',
		collapsed: false, 
		insertAfterLead: false, 
		grafsInSummary: 0, 
		sentencesPerGraf: 0, 
		maxSummaryLength: 300, 
		minimumHeadlines: 0 
	});

### Options/defaults:

There are a lot of options for as little as this plugin does. It was just easier for me to leave it up to you instead of deciding what the most generally-acceptable output and options would be.

#### General

#####	target

This is the element to prepend the output to. 

Default: the element that the `tldr()` function was called on.

##### insertAfterLead

If true, inserts the output before the first headline in the content instead of at the very top.

Default: `false`


##### headlineElements

The elements to consider section markers. This should be a comma-separated string of tag names.

Default: `'h2,h3,h4'`

##### dataAttribute

The data attribute (without "data-") to check on the headline elements for summaries. If it exists, it takes precedence over the generated summary. Example markup:

	<h2 data-tldr="This is a single-line summary for the section below.">Section title</h2>

Default: `'tldr'`

##### useMetaDescription

If it exists, prepend the contents of a description or og:description meta tag to the output list.

Default: `true`

##### minimumHeadlines

The minimum number of headline elements that must exist in text for TL;DR to do it's thing. Set it to 0 for no limit (always run). This is useful if you're using the useMetaDescription option above.

Default: `3`


#### FORMATTING

##### wrapper

The markup for the element to wrap the entire summary (including title element) in. Only the opening tag is required.

Default: `'<div class=tldr-wrapper>'`

##### listType

Output `ol` (numbered) or `ul` (bullet) list of headlines and their summaries.

Default: `'ol'`

##### headlineTag

The tag with which to wrap the headlines for the section. Summaries are automatically wrapped in `<p>` tags following the headline.

Default: `'strong'`

##### headerTag

The tag for the main header above the list.

Default: `'h4'`

##### headerTitle

The text for the header above the list.

Default: `'TL;DR'`

##### collapsed

If `collapsed` is true, summaries are hidden on load and expand and collapse when their headlines are clicked.

Default: `false`

##### addClickHandler

*Ignored unless `collapsed` is true*

If true, this will add a handler to open a collapsed summary on click. Only set it to false if you're using `collapsed` and are providing a custom handler (e.g. your styling allows for a popup on hover or you want a more complex display mechanism).

Setting this to `false` applies no handlers to the headlines at all.

Default: `true`

##### accordion

*Ignored unless `collapsed` and `addClickHandler` are true*

If true (and you're using collapsed summaries and default click handler), expanding a summary by clicking the headline will collapse other summaries. 

Default: `true`

#### SUMMARIZATION

##### grafsInSummary

The number of paragraphs to summarize per section. If this is set to a value higher than 1, the first `sentencesPerGraf` setting will be used to extract the first *X* sentences from each paragraph until the `maxSummaryLength` is reached.

If set to 0, then no limit is imposed and `maxSummaryLength` will determine the result.

Default: `1`

##### sentencesPerGraf

The number of sentences per paragraph collected for the summary. If set to 0, no limit is imposed. By default it only gathers the first sentence (up to `maxSummaryLength`).

Default: `1`


##### maxSummaryLength

The maximum characters per summary. Setting this to 0 removes the character limit but still allows `grafsInSummary` and `sentencesPerGraf` to impose limits.


### License

	Copyright (c) 2014 Brett Terpstra, http://brettterpstra.com
	
	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:
	
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
