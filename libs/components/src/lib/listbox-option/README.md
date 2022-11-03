# Option

```js
<script type='module'>
  import '@vonage/vivid/option';
</script>
```

## Members

### Text

Use the `text` attribute to set the option's text.

- Type: `string`
- Default: `undefined`

```html preview
<vwc-option text="Option"></vwc-option>
```

### Icon

Add the `icon` attribute to add an icon to the option.
Check out the [vivid icons gallery](https://icons.vivid.vonage.com) to see what icons are available.

- Type: `string`
- Default: `''`

```html preview
<vwc-option text="Option" icon="chat-line"></vwc-option>
```

### Selected

Add the `selected` attribute to select the option.

- Type: `boolean`
- Default: `false`

```html preview
<vwc-option text="Option" selected></vwc-option>
```

### Disabled

Add the `disabled` attribute to disable the option.

- Type: `boolean`
- Default: `false`

```html preview
<vwc-option text="Option" disabled></vwc-option>
```