The user wants to add a photo to the slideshow on about.html.

Follow these steps:

1. Ask the user: "Which photo slot do you want to fill? (1–5)" and "What is the filename of your photo? (e.g. shop-front.jpg)"
   - Remind them to place the photo file in the `The Tire Boys/` project folder first.

2. Once they answer, open `about.html` and find the matching slide placeholder. Slides are numbered 1–5 in order. Each one looks like:
```html
<div class="slide-placeholder">
  <i class="fa-solid fa-camera"></i>
  <span>Add [Label] Photo</span>
</div>
```

3. Replace that placeholder block with:
```html
<img src="FILENAME" alt="The Tire Boys - LABEL">
```
Where FILENAME is what the user provided and LABEL is the slot label (e.g. Shop, Team, Service, Exterior, Customer).

4. Also remove the "Photos coming soon" note at the bottom of the slideshow if all 5 slots are now filled.

5. Confirm the change was made and ask if they'd like to commit and deploy to Vercel.
