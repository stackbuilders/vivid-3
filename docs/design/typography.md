# Typography

## Typefaces

Set the font custom properties of your choice (or all) to override the default typography styles with your own.

```css
--vvd-typography-headline
--vvd-typography-subtitle
--vvd-typography-heading-1
--vvd-typography-heading-2
--vvd-typography-heading-3
--vvd-typography-heading-4
--vvd-typography-base
--vvd-typography-base-bold
--vvd-typography-base-code
--vvd-typography-base-condensed
--vvd-typography-base-condensed-bold
--vvd-typography-base-extended
--vvd-typography-base-extended-bold
```


```html preview
<style>
  :root {
  --vvd-typography-heading-4: 500 20px/1.4 Georgia;
  --vvd-typography-base-code: 400 16px monospace;
  --vvd-typography-base-bold: 500 16px Georgia;
  }
</style>
<vwc-header>
  This header typeface is set by '--vvd-typography-heading-4' 
</vwc-header>
<pre>/*
 * This block of code typeface is set by '--vvd-typography-base-code'
 */
</pre>
<vwc-button appearance="filled" label="This button typeface is set by '--vvd-typography-base-bold'"></vwc-button>
```

---

## Font size

Use `--vvd-size-font-scale-base` to define the base font size which all typefaces sizes are based on.

- Default: `'16px'`

Note that when using the [core styles](/#core-optional) with the `vvd-root` class set on the root element (i.e., `<html>`), the user-agent's default font size is unset (generally default to `'16px'`) and the `--vvd-size-font-scale-base` custom property is set to `'1rem'` to ensure end user's font size preferences are respected.

```html preview
<style>
 .vvd-root:root {
  --vvd-size-font-scale-base: 1.3rem;
 }
</style>

<vwc-header>
  This header's title is 30% larger
</vwc-header>

<pre>/*
 * This block of code too
 */
</pre>

<vwc-button appearance="filled" label="And the button label"></vwc-button>
```

---

## Typefaces preset

The following CSS custom properties can be referred to style the text in your application with the Vivid design language:

```html preview
<div style="font: var(--vvd-typography-headline)">headline</div>
<div style="font: var(--vvd-typography-subtitle)">subtitle</div>
<div style="font: var(--vvd-typography-heading-1)">heading-1</div>
<div style="font: var(--vvd-typography-heading-2)">heading-2</div>
<div style="font: var(--vvd-typography-heading-3)">heading-3</div>
<div style="font: var(--vvd-typography-heading-4)">heading-4</div>
<div style="font: var(--vvd-typography-base-condensed)">base-condensed</div>
<div style="font: var(--vvd-typography-base-condensed-bold)">base-condensed-bold</div>
<div style="font: var(--vvd-typography-base)">base</div>
<div style="font: var(--vvd-typography-base-bold)">base-bold</div>
<div style="font: var(--vvd-typography-base-extended)">base-extended</div>
<div style="font: var(--vvd-typography-base-extended-bold)">base-extended-bold</div>
<div style="font: var(--vvd-typography-base-code)">base-code</div>
```



## Using Vivid Typography

The Vivid typography css is optional. To use it, you will need to [include the typography styles](/getting-started/advanced).

The typography style target both HTML tags and css classes.  
All `headlines` and `p` elements also get `margin-block`.  
Use the class `tight` to remove `margin-block`.  

### HTML tags

```html preview
<style>
.wrapper { /* for demo purposes */
	display: flex;
	flex-direction: column;
	row-gap: 8px;
}
</style>
<div class="wrapper">
	<h1>heading-1</h1>
	<h2>heading-2</h2>
	<h3>heading-3</h3>
	<h4>heading-4</h4>
	<p>paragraph</p>
	<b>bold</b>
	<strong>strong</strong>
	<pre>pre text</pre>
	<var>var text</var>
	<code>code text</code>
	<kbd>kbd text</kbd>
	<samp>samp text</samp>
	<small>small text</small>
	<small><b>small  + bold text</b></small>
	<small><strong>small + strong text</strong></small>
	<figcaption>figcaption text</figcaption>
	<figcaption><b>figcaption + bold text</b></figcaption>
	<figcaption><strong>figcaption + strong text</strong></figcaption>
	<p>text with <sub>sub text</sub></p>
	<p>text with <sup>sup text</sup></p>
</div>
```

### Css Classes

```html preview
<style>
.wrapper { /* for demo purposes */
	display: flex;
	flex-direction: column;
	row-gap: 8px;
}
</style>
<div class="wrapper">
	<div class="headline tight">headline</div>
	<div class="subtitle tight">subtitle</div>
	<div class="heading1 tight">heading-1</div>
	<div class="heading2 tight">heading-2</div>
	<div class="heading3 tight">heading-3</div>
	<div class="heading4 tight">heading-4</div>
	<div class="font-base-code tight">base-code</div>
	<div class="font-base-condensed tight">base-condensed</div>
	<div class="font-base tight">font-base</div>
	<div class="font-base-extended tight">font-base-extended</div>
	<div class="font-base-condensed-bold tight">font-base-condensed-bold</div>
	<div class="font-base-bold tight">font-base-bold</div>
	<div class="font-base-extended-bold tight">font-base-extended-bold</div>
</div>
```

