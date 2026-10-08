# Fluent theme

Reference for the Fluent Light and Fluent Dark themes in this Grafana tree. The look follows Fluent 2 tokens. Control names and behavior follow the [Fluent UI React controls catalog](https://developer.microsoft.com/en-us/fluentui#/controls/web/) (Fluent UI React 8.125.6 on that page). Grafana components are restyled. Fluent UI is not installed.

Stock Grafana themes (light, dark, visual refresh, accessibility) stay unchanged. Product UI copy stays in English.

## How a theme becomes Fluent

Theme files:

- `packages/grafana-data/src/themes/themeDefinitions/fluent_light.json` (`fluent_light`)
- `packages/grafana-data/src/themes/themeDefinitions/fluent_dark.json` (`fluent_dark`)

`hasSolidBrandGradient` in `packages/grafana-data/src/themes/createTheme.ts` is the gate. It is true when `colors.gradients.brandHorizontal` does not contain the substring `gradient`. Both Fluent themes store a solid brand color there, so every Fluent-only style checks this helper. Other themes keep a real CSS gradient and skip those styles.

Headings `h1`–`h6` use `fontWeightMedium` (600) when the helper is true.

## Tokens

Radius is shared: 2px small, 4px default, 8px large.

Type is shared: Segoe UI for UI text, Consolas for code, 14px body on a 16px root, weights 400 / 600 / 700.

### Color

| Token                           | Fluent Light         | Fluent Dark                                                     |
| ------------------------------- | -------------------- | --------------------------------------------------------------- |
| Brand / primary / accent / link | `#0f6cbd`            | `#479ef5`                                                       |
| Brand hover                     | `#115ea3`            | `#62b0f7` (accent shade; primary hover falls back to the brand) |
| Text on brand                   | `#ffffff`            | `#000000`                                                       |
| Text primary                    | `#242424`            | `#ffffff`                                                       |
| Text secondary                  | `#424242`            | `#d6d6d6`                                                       |
| Text disabled                   | `#bdbdbd`            | `#5c5c5c`                                                       |
| Canvas                          | `#fafafa`            | `#141414`                                                       |
| Surface                         | `#ffffff`            | `#1f1f1f`                                                       |
| Secondary surface               | `#f5f5f5`            | `#292929`                                                       |
| Elevated surface                | `#ffffff`            | `#292929`                                                       |
| Border weak                     | `#e0e0e0`            | `#333333`                                                       |
| Border medium                   | `#d1d1d1`            | `#666666`                                                       |
| Border strong                   | `#616161`            | `#adadad`                                                       |
| Hover wash                      | `#f5f5f5`            | `#383838`                                                       |
| Selected wash                   | `#ebebeb`            | `#333333`                                                       |
| Disabled fill                   | `#f0f0f0`            | `#141414`                                                       |
| Error                           | `#c50f1f`            | `#dc626d`                                                       |
| Warning                         | `#da3b01`            | `#faa06b`                                                       |
| Success                         | `#107c10`            | `#54b054`                                                       |
| Scrollbar thumb                 | `#8f8f8f`            | `#adadad`                                                       |
| Overlay scrim                   | `rgba(0, 0, 0, 0.4)` | `rgba(0, 0, 0, 0.5)`                                            |
| Field background                | `#ffffff`            | `#292929`                                                       |
| Field border                    | `#d1d1d1`            | `#666666`                                                       |

### Elevation

Light shadows:

- z1: `0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)`
- z2: `0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)`
- z3: `0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.14)`

Dark uses the same offsets with alpha `0.24` on the tight shadow and `0.28` on the drop shadow.

### Shared interaction

- Focus stroke: 2px solid `#000000` in light, `#ffffff` in dark, offset 2px, no glow.
- Fields: 1px border, stronger bottom edge (`border.strong`), brand underline on focus (`inset 0 -1px 0 0` brand). No outer focus ring on the field.
- Callouts (menus, popovers, tooltips): 4px radius, 1px weak border, z2 shadow.
- Chart series colors are the Fluent palette in `visualization.palette` (brand blue, magenta, green, orange, indigo, teal, purple, gold, red, cyan). Chart geometry stays Grafana uPlot.

## Control catalog

Each row is one control from the Fluent UI React catalog, then the Grafana piece that stands in for it.

Status:

- **Matched** means the Fluent theme restyles that Grafana component.
- **Partial** means the chrome matches and some Fluent detail is still Grafana.
- **None** means Grafana has no equivalent, so nothing was restyled.

### Basic inputs

| Fluent control | Fluent spec                                                                                                                                                       | Grafana equivalent                         | What this theme does                                                                                                                                                      | Status  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Button         | Primary is a flat brand fill, white or contrast label, semibold, 4px corner, darker brand on hover, no shadow. Default is an outline with a stronger bottom edge. | `Button`, `LinkButton`                     | Primary, destructive, success, and accent fills use the brand or status color. Outline and secondary use a field border and a strong bottom edge. Weight 600. Radius 4px. | Matched |
| Checkbox       | 16px box, 2px corner, strong border, thin check inset from the edges. Hover on an empty box shows a gray check. Checked is brand fill plus a contrast check.      | `Checkbox`. Multi-select options reuse it. | Same geometry. Hover check is `#616161` in light (`border.strong`). Disabled empty boxes stay empty.                                                                      | Matched |
| ChoiceGroup    | Round radios. The selected item is brand. A segmented group sits on a neutral track.                                                                              | `RadioButtonGroup`, `RadioButtonList`      | Segmented group uses the secondary track. The selected label is a raised white (or elevated) segment with the z1 shadow. The radio dot uses the Fluent focus stroke.      | Matched |
| ComboBox       | Field plus a callout list. The selected row is a neutral wash, not a brand bar.                                                                                   | `Combobox`                                 | Field focus is the brand underline. The menu is the shared callout. The selected option hides the brand side bar. Option label weight is 600.                             | Matched |
| Dropdown       | Same field and callout as ComboBox.                                                                                                                               | `Select`                                   | Same field focus, callout menu, and no brand side bar on the selected option.                                                                                             | Matched |
| Label          | 14px, semibold, above the control, primary text.                                                                                                                  | `Label`, `Field`                           | Size and weight come from the theme.                                                                                                                                      | Matched |
| Link           | Brand color. No underline at rest. Underline on hover, slightly darker brand.                                                                                     | `TextLink`, `.text-link`                   | Inline links no longer start underlined. Hover underlines and uses the brand shade.                                                                                       | Matched |
| Rating         | Row of stars, brand or neutral.                                                                                                                                   | None                                       | Not built.                                                                                                                                                                | None    |
| SearchBox      | Text field with a leading search icon and a clear button.                                                                                                         | `FilterInput` on `Input`                   | Uses the Fluent field (border, strong bottom, brand focus).                                                                                                               | Matched |
| Slider         | 4px rounded track, brand fill, circular thumb with a brand ring and a light face, no glow.                                                                        | `Slider`, `RangeSlider`                    | Rail is `border.medium`. Thumb is 16px, 2px brand border, surface fill, no shadow. Focus is the 2px stroke.                                                               | Matched |
| SpinButton     | Text field with up and down steppers inside the end.                                                                                                              | Number `Input` where Grafana uses one      | The field chrome matches. There is no dedicated stepper control.                                                                                                          | Partial |
| TextField      | Full border, stronger bottom edge, brand underline on focus, 4px corner.                                                                                          | `Input`, `TextArea`                        | Same treatment. Text areas keep the strong bottom edge.                                                                                                                   | Matched |
| Toggle         | Pill track. Off track is a strong gray. Thumb is white. On track is brand.                                                                                        | `Switch`                                   | Off track is `border.strong`. Thumb is white with no shadow. Checked check mark on the thumb is hidden.                                                                   | Matched |

### Galleries and pickers

| Fluent control    | Fluent spec                                                                                                                 | Grafana equivalent                 | What this theme does                                                                                                           | Status  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Calendar          | Month grid in a callout. Today has a brand outline. The selected day is a brand fill. Days are slightly rounded, not pills. | Time picker calendar, `DatePicker` | Callout chrome. Day radius is 4px. Today uses a brand outline. Weekday labels use secondary text.                              | Matched |
| ColorPicker       | Panel in a callout.                                                                                                         | `ColorPickerPopover`               | Popover uses the shared callout. The spectrum is a 4px panel with an 8px gap, 8px sliders, and a 16px thumb with a white ring. | Matched |
| DatePicker        | Text field that opens a calendar callout.                                                                                   | `DatePicker`                       | Field chrome plus callout. The modal date surface uses the z2 shadow.                                                          | Matched |
| PeoplePicker      | Field of persona chips.                                                                                                     | None                               | Not built.                                                                                                                     | None    |
| Pickers           | Field of removable neutral chips, 4px corner, hairline border.                                                              | `TagsInput` / `TagItem`            | Chips are a neutral pill: secondary fill, medium border, regular weight. Name-based rainbow colors are off.                    | Matched |
| SwatchColorPicker | Grid of color swatches.                                                                                                     | Color picker swatches              | Swatches are 4px squares. The selected swatch has a brand ring. Hover draws a strong border and does not scale.                | Matched |
| TimePicker        | Field or button that opens a time list.                                                                                     | `TimePicker`, time range picker    | Callout chrome. Quick ranges use a neutral selected wash and no brand side bar. The toolbar time control looks like a field.   | Matched |

### Items and lists

| Fluent control | Fluent spec                                                                                                                    | Grafana equivalent                | What this theme does                                                                                                                                                                                                                | Status  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| ActivityItem   | Avatar, primary line, secondary line.                                                                                          | None as a component               | Not restyled.                                                                                                                                                                                                                       | None    |
| DetailsList    | Header on a secondary surface, semibold secondary header text, medium header rule. Row hover and selection are neutral washes. | `Table` (TableNG and TableRT)     | Header background is secondary. Header text is secondary at weight 600 with a medium bottom border. Row hover and selected colors come from the table tokens. No cell drop shadow. Header labels do not turn into underlined links. | Matched |
| DocumentCard   | White card, hairline border, 4px or 8px corner, short shadow optional.                                                         | `Card`                            | Primary surface and a weak border.                                                                                                                                                                                                  | Matched |
| Facepile       | Overlapping circular personas.                                                                                                 | None                              | Not built.                                                                                                                                                                                                                          | None    |
| GroupedList    | List sections with a header row.                                                                                               | `Collapse`, `CollapsableSection`  | Header is 14px semibold primary text, with a weak bottom rule and a neutral hover. The chevron does not paint its own wash. The loading bar is a 2px brand segment on a weak track.                                                 | Matched |
| HoverCard      | Small callout on hover, 4px corner, hairline border.                                                                           | `Tooltip`, chart `TooltipPlugin2` | 4px radius and a weak border.                                                                                                                                                                                                       | Matched |
| Basic List     | Plain stacked rows.                                                                                                            | Various lists                     | No separate list skin. Rows that use table or menu styles follow those.                                                                                                                                                             | Partial |
| Persona        | Circle avatar, name, secondary text.                                                                                           | None                              | Not built. User chips stay Grafana.                                                                                                                                                                                                 | None    |

### Commands, menus, and navigation

| Fluent control | Fluent spec                                                                                                         | Grafana equivalent                      | What this theme does                                                                                        | Status  |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| Breadcrumb     | Chevron separators. Current page is semibold. Earlier items are regular and turn brand with an underline on hover.  | `Breadcrumbs`                           | Current crumb is primary text at weight 600. Links are regular, brand and underlined on hover.              | Matched |
| CommandBar     | Flat icon and text commands. Hover is a neutral wash. The active command is a selected fill, not a brand underline. | `ToolbarButton`, dashboard time toolbar | The canvas variant looks like a field. Active state is `action.selected` with no brand bar.                 | Matched |
| ContextualMenu | Callout list, 4px corner, hairline border, short shadow. Items highlight with a neutral wash.                       | `Menu`, `SubMenu`                       | Weak border, z2 shadow, menu radius from the theme token.                                                   | Matched |
| Nav            | Vertical items, neutral hover, selected wash, brand only as a marker when needed.                                   | Mega menu, nav chrome                   | Already branched for Fluent: neutral surfaces, no Grafana orange chrome.                                    | Matched |
| OverflowSet    | Commands that collapse into a menu.                                                                                 | Toolbar overflow                        | The overflow menu uses the menu callout.                                                                    | Partial |
| Pivot          | Text tabs. The active tab is brand text with a solid brand underline. Hover is a neutral wash, not a bar.           | `Tabs` / `Tab`                          | Hover is `action.hover`. Active label is primary text, weight 600, solid brand underline, square indicator. | Matched |

### Notification and engagement

| Fluent control | Fluent spec                                                                                           | Grafana equivalent                        | What this theme does                                                                                                                                                                                                        | Status  |
| -------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Coachmark      | Pulsing beacon that points at a control.                                                              | None                                      | Not built.                                                                                                                                                                                                                  | None    |
| MessageBar     | Full-width bar, 4px corner, pale status fill, 16px status icon, primary text. Info is a neutral wash. | `Alert`                                   | 4px corner. Info uses the secondary surface and a weak border. Error, warning, and success mix the status color into the surface (12% light, 22% dark) with a stronger mix on the border. Icon is 16px in the status color. | Matched |
| TeachingBubble | Rich callout with a title and actions.                                                                | `InlineToast` is the nearest small status | Toast is a 4px elevated surface with a weak border and z1 shadow, not a pill. It is not a full teaching bubble.                                                                                                             | Partial |

### Progress

| Fluent control    | Fluent spec                        | Grafana equivalent                    | What this theme does                                                                                      | Status  |
| ----------------- | ---------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- |
| ProgressIndicator | 2px track, brand bar, no gradient. | `LoadingBar`                          | Track is `border.weak`. The bar is 2px solid brand.                                                       | Matched |
| Shimmer           | Neutral gray blocks that sheen.    | `Skeleton` on Badge, Tag, and similar | Block is `#ebebeb` in light and `#292929` in dark. The sheen is `#f5f5f5` in light and `#383838` in dark. | Matched |
| Spinner           | Brand-colored spinning arc.        | `Spinner`                             | Fluent themes draw a rounded brand arc (1.5s rotation). Reduced motion keeps the hourglass.               | Matched |

### Surfaces

| Fluent control | Fluent spec                                                                      | Grafana equivalent                                                              | What this theme does                                                                                                           | Status  |
| -------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Callout        | 4px corner, hairline border, elevation 8 shadow.                                 | `getCalloutChrome` on menus, time picker, cascader, color picker, chart tooltip | Shared helper: default radius, weak border, z2 shadow.                                                                         | Matched |
| Dialog         | Title semibold, even header and body padding, scrim behind, focus stroke inside. | `Modal`                                                                         | Header min height 48px. Title is h4 size at weight 600. Content padding lines up. Focus inside the dialog uses the 2px stroke. | Matched |
| Modal          | Same shell as Dialog, centered over the scrim.                                   | `Modal`                                                                         | Same as Dialog. Scrim is the overlay token.                                                                                    | Matched |
| Panel          | Side sheet, 8px outer corner when floating, even header padding.                 | `Drawer`                                                                        | Inset from the viewport, 8px radius, even header padding.                                                                      | Matched |
| ScrollablePane | Neutral thumb, thin track.                                                       | `CustomScrollbar`, global `body *` scrollbar                                    | Thumb is the scrollbar token (light `#8f8f8f`, dark `#adadad`), 10px, 4px radius.                                              | Matched |
| Tooltip        | Small callout, 4px corner, hairline border.                                      | `Tooltip`                                                                       | Default radius and a weak border.                                                                                              | Matched |

### Charts, utilities, and references

The catalog also lists AreaChart, DonutChart, GaugeChart, HeatMapChart, HorizontalBarChart, Legends, LineChart, PieChart, SankeyChart, SparklineChart, TreeChart, VerticalBarChart, plus utilities (FocusZone, Layer, and similar) and icon references.

Grafana charts stay uPlot. Series colors come from the Fluent palette above. Axes, legends, and glyphs are not rebuilt. Utilities have no visual skin. The Fluent icon font is not swapped in.

## App chrome

These surfaces are not named controls on the catalog page. They already branch on `hasSolidBrandGradient`:

- Top bar, search, and mega menu
- Login layout and form
- Home sections and empty states (the Grafana mascot is hidden)
- News drawer and news list (the grot image is hidden)
- Footer and branding
- Dashboard toolbar

Field validation is a soft error surface: error background, border, and text, 4px radius, no speech-bubble arrow. The code editor uses the field bottom edge, a line highlight, and the Fluent token colors in `components.codeEditor`.

## Left as Grafana

- Fluent system icons
- Chart rendering other than the palette
- Rating, Persona, Facepile, PeoplePicker, Coachmark, and a real TeachingBubble
- SpinButton steppers
- Stock, visual refresh, and accessibility themes

## Check

1. Set the user theme to Fluent Light or Fluent Dark.
2. Open Administration, a dashboard, and the time range picker.
3. Confirm a primary button, a field, a checkbox (including hover), tabs, a menu, the calendar, a data grid, a toolbar control, and a modal or drawer.
4. Switch back to Light or Dark and confirm those themes look as they did before.
