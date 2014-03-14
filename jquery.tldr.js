/*
TL;DR jQuery Plugin
Brett Terpstra 2013

Description:

	Scans for headlines in a block of content and creates a "TL;DR" element at the top
	with the headline and a summary generated either from a data-tldr attribute on the
	headline or from the first sentence of the next paragraph after.

Options/defaults:

	// GENERAL
	target: '',						// target to prepend output to, defaults to the context of the plugin
	insertAfterLead: false, 				// insert the output before the first headline
									// instead of at the top
	headlineElements: 'h2,h3,h4', 		// Elements to consider headlines
	dataAttribute: 'tldr', 				// data attribute for summaries
	minimumHeadlines: 3					// minimum number of headlines in text required to execute, 0 no limit
	useMetaDescription: true 			// Prepend description or og:description contents

	// FORMATTING
	wrapper: '<div class=tldr-wrapper>',	// element to wrap the list in
	listType: 'ol', 					// ol or ul
	headlineTag: 'strong', 				// element to wrap the headlines in
	headerTag: 'h4', 					// the tag for the header above the list
	headerTitle: 'TL;DR', 				// the title of the block

	collapsed: false,		 			// if true, summaries collapse and expand on headline clicks
		addClickHandler: true,			// add handler to open collapsed summary on click
									// set to false if you're providing a custom handler
									// ignored unless collapsed is true
		accordion: true,		 		// only one visible summary at a time,
									// ignored unless collapsed is true

	// SUMMARIZATION
	grafsInSummary: 1, 					// number of paragraphs to summarize
	sentencesPerGraf: 1, 				// sentences per graf in summary
	maxSummaryLength: 200, 				// maximum characters per summary, 0 for unlimited

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
*/

(function($) {
	$.fn.tldr = function(options) {
		var opts = $.extend({}, $.fn.tldr.defaults, options);
		return this.each(function() {
			$this = $(this);
			output = $.fn.tldr.build($this, opts);
			if (output) {
				if (opts.insertAfterLead) {
					output.insertBefore($(opts.headlineElements,opts.target).first());
				} else {
					output.prependTo($(opts.target === '' ? $this : opts.target));
				}
			}
		});
	};

	function trim(text) {
		return text.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\n+/,' ');
	}

	function getSentences(text, count) {
		text = trim(text);
		var matches = text.match(/\w.+?[\?\.\!]/g);
		if (matches && matches.length > 0) {
			if (count === 0) {
				return matches.join(' ');
			} else {
				return matches.slice(0,count).join(' ');
			}
		} else {
			return text;
		}
	}

	function truncateAtWord(text) {
		return text.substring(0,text.lastIndexOf(" ")).replace(/[\?\!\.,;:-]$/,'') + "&hellip;";
	}

	function convertToTag(input) {
		if (!/^<.*>$/.test(input)) {
			return "<" + input + ">";
		} else {
			return input;
		}
	}

	$.fn.tldr.build = function(el, opts) {
		var $this = el,
			headers = [],
			wrapper = $(convertToTag(opts.wrapper)),
			output = $(/(ol|ul)/.test(opts.listType) ? convertToTag(opts.listType) : '<ol>'),
			title = $(convertToTag(opts.headerTag)).html(opts.headerTitle),
			$headlineElements = $this.find(opts.headlineElements);

		if (opts.minimumHeadlines > 0 && $headlineElements.length < opts.minimumHeadlines) {
			return false;
		}

		$headlineElements.each(function(i, n) {
			var summary = "", target;

			if ($(n).data(opts.dataAttribute)) {
				summary = $(n).data(opts.dataAttribute);
				if (opts.maxSummaryLength > 0) {
					summary = summary.substring(0,opts.maxSummaryLength);
				}
			} else {
				var grafs = $(n).nextUntil(opts.headlineElements),
					totalLength = 0;
				if (opts.grafsInSummary > 0) {
					grafs = grafs.slice(0,opts.grafsInSummary)
				}
				if (grafs && grafs.length > 0) {
					for ( p = 0; p < grafs.length; p++ ) {
						var summaryText = getSentences($(grafs[p]).text(),opts.sentencesPerGraf),
							prefix = p > 0 ? '<span class="prefix">[&hellip;]</span> ' : '';
						if (opts.maxSummaryLength > 0) {
							if (totalLength + summaryText.length < opts.maxSummaryLength) {
								summary += '<p>' + prefix + summaryText + '</p> ';
								totalLength += summaryText.length;
							} else {
								summaryText = truncateAtWord(summaryText.substring(0,opts.maxSummaryLength - totalLength));
								if (summaryText.length > 35) {
									summary += '<p>' + prefix + summaryText + '</p> ';
								}
								break;
							}
						} else {
							summary += '<p>' + summaryText + '</p> ';
						}
					}
				}
			}

			if ($(n).attr('id')) {
				target = "#" + $(n).attr('id');
			} else {
				var id = $(n).text().replace(/[^a-z]/gi, '');
				$(n).attr('id',id);
				target = "#" + id;
			}

			headers.push({
				target: target,
				title: $(n).text(),
				summary: summary
			});
		});

		$(headers).each(function(i, n) {
			var headline = $(convertToTag(opts.headlineTag)).text(n.title).addClass('tldr-headline');
			if (opts.collapsed && opts.addClickHandler) {
				headline.css('cursor','pointer').click(function(ev) {
					if (ev.target.tagName === 'A') {
						return true;
					}
					ev.preventDefault();
					if (opts.accordion) {
						$(this).closest('ul,ol').find('.summary').slideUp();
					}
					var nextSummary = $(this).next('.summary');
					if (nextSummary.is(':visible')) {
						nextSummary.slideUp();
					} else {
						nextSummary.slideDown();
					}
				});
				headline.append($('<a>').attr('href',n.target).html(' &rarr;'));
				var content = $('<div class=summary>').html(n.summary).css({
					display: 'none'
				});
				output.append($('<li>').append(headline).append(content));
			} else {
				var content = $('<div class=summary>').html(n.summary);
				output.append($('<li>').append(headline).append(content));
				headline.wrap('<a href="'+n.target+'" />');
			}
		});

		if (opts.useMetaDescription && $('meta[property$=description]').length > 0) {
			var intro = truncateAtWord($('meta[property$=description]').attr('content'));
			output.prepend($('<li>').html(intro));
		}

		return wrapper.append(title).append(output);
	};

	// Defaults
	//
	$.fn.tldr.defaults = {
		headlineElements: 'h2,h3', // Elements to consider headlines
		target: '', // target to prepend output to
		wrapper: '<div class=tldr-wrapper>', // element to wrap the list in
		listType: 'ol', // ol or ul
		headlineTag: 'strong', // element to wrap the headlines in
		headerTag: 'h4', // the tag for the header above the list
		headerTitle: 'TL;DR', // the title of the block
		dataAttribute: 'tldr', // data attribute for summaries
		collapsed: false, // if true, summaries collapse and expand on headline clicks
			addClickHandler: true, // add handler to open collapsed summary on click, ignored unless collapsed is true
			accordion: true, // only one visible summary at a time, ignored unless collapsed is true
		insertAfterLead: false, // insert the output before the first headline instead of at the top
		grafsInSummary: 1, // number of paragraphs to summarize, 0 for unlimited
		sentencesPerGraf: 1, // sentences per graf in summary, 0 for unlimited
		maxSummaryLength: 200, // maximum characters in summary, 0 for unlimited
		minimumHeadlines: 3, // minimum number of headlines in text required to execute
		useMetaDescription: true // Prepend description or og:description contents
	};

})(jQuery);
