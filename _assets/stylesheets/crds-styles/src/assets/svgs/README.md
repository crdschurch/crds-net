## SVG Support

`crds-styles` provides a robust icon-system for implementing SVGs and CSS-based icon-selectors throughout your digital projects. Please refer to [the DDK](https://design-int.crossroads.net/ui/icons/directory) for specific implementation details and examples of markup. Please refer to [this project's README](https://github.com/crdschurch/crds-styles#svgs) file for information on updating Webpack to consume the SVGs by your client application.

### Adding New SVGs

We're using [Sketch](https://www.sketchapp.com/) to develop consistent iconography for this project, by way of an SVG library available for sync via Dropbox (see the digital product owner for shared access to this library).

To add new icons to the library – open the file and duplicate the last artboard. When you do, be sure to drag the artboard down to the bottom of the lefthand panel. Rename the artboard appropriately (this name will eventually be the class/ID used to render the icon).

_Note: If you're adding a new artboard beyond the end of a row, you're welcome to start a new row, just keep spacing and positioning consistent._

![](http://crds-cms-uploads.s3.amazonaws.com/sketch-icon-docs/duplicate-artboard.gif)

Then you can delete the duplicated contents of that artboard.

![](http://crds-cms-uploads.s3.amazonaws.com/sketch-icon-docs/delete-layer.gif)

Next, find the SVG you're doing to add to the library. You can simply copy and paste from your filesystem into Sketch.

![](http://crds-cms-uploads.s3.amazonaws.com/sketch-icon-docs/import-shape.gif)

Lock the dimensions into place, resize the artwork to `236px` on its longer side, and position it in the exact center of the artboard.

![](http://crds-cms-uploads.s3.amazonaws.com/sketch-icon-docs/resize-and-center.gif)

You can also remove all the excess folders and layers from the icon so all the artboard contains is a single layer (our goal is that the exported shape for the SVG is only a single `<path>` element).

![](http://crds-cms-uploads.s3.amazonaws.com/sketch-icon-docs/remove-extra-layers.gif)

And you're ready to export! Be sure to **export the entire artboard**, not just the artwork. We require that each SVG export be `256px` square. Export the new SVG layer to `src/assets/svgs` in this project, then you're ready to compile into a single SVG.

![](http://crds-cms-uploads.s3.amazonaws.com/sketch-icon-docs/export-svg.gif)

### Compile SVG sprites

Run `npm run build-svg` to compile the SVGs into the correct sass and sprite files

### Adding new SVGs to the DDK

To add new icons to the DDK, add the icon name to the `icons` array in `icons.services.ts` of the DDK.