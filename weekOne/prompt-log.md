# Prompt Log

This log records the prompts and decisions used to build the Week 1 project.

## 1. Define the audience

**Prompt:** "The site is for Merlin."

**Decision:** Treat Merlin as the subject of a personal landing page about Merlin the wizard.

## 2. Choose the three sections

**Prompt:** "What sections should we have for Merlin the wizard?"

**Decision:** Use exactly three sections: Meet Merlin, Merlin's Magic, and Seek Merlin's Guidance. The single call to action will be "Request Merlin's Guidance."

## 3. Set the build process

**Prompt:** "Sounds good, we are going to create these one at a time and review before moving forward."

**Decision:** Build and review one section at a time. Do not begin the next section until the current section is approved.

## 4. Create the foundation and first section

**Prompt:** "Create a vanilla HTML JS CSS in the weekOne directory."

**Decision:** Create a dependency-free HTML, CSS, and JavaScript foundation. Implement only the Meet Merlin section for the first review.

**Verification:** Opened the page at desktop and mobile sizes, checked its document structure, and inspected the browser console.

**Caught mistake:** The first browser check reported a `404` error because the page requested a favicon that did not exist. We fixed it by adding a small inline star favicon to `index.html`, avoiding an extra image file and removing the failed request.

## 5. Add the second section

**Prompt:** "Add Merlin's Magic if you approve section one."

**Decision:** Add only the approved second section, Merlin's Magic. Keep it as one section with three examples inside it: Prophecy, Enchantment, and Counsel.

**Verification:** Checked the page after adding the section. The site had exactly two sections, and the third section and CTA were not added yet.

## 6. Add the third section and CTA

**Prompt:** "Approve lets do section 3."

**Decision:** Add the final approved section, Seek Merlin's Guidance. Include the one call to action, "Request Merlin's Guidance," and use a small JavaScript click message so the button has visible behavior.

**Verification:** The finished page has exactly three sections and one CTA button. JavaScript passed `node --check`, and the local preview returned `200 OK`.
## 7. Choose deployment path

**Prompt:** "Add in the Prompt Log, we are going to GitHub Pages via Actions."

**Decision:** Use GitHub Pages with GitHub Actions as the deployment path for the finished Week 1 site.

**Verification:** Record the deployment choice now. The actual GitHub Actions workflow will be created and checked in a later step.
## 8. Add magic button effect

**Prompt:** "When we click the Merlin button have the screen explode with magic, have a ? above the button... are you magical?"

**Decision:** Add the question "Are you magical?" above the existing call-to-action button. Keep one CTA button, and make the click create a short magic burst using vanilla JavaScript and CSS animation.

**Verification:** The page still has exactly three sections and one CTA button. JavaScript passed `node --check`, the click simulation created 42 sparks, and the local preview returned `200 OK`.
