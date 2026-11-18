// Ekstra seksjoner (1,5 ganger-regelen). Liste av [H2, HTML]. Settes inn før «Common mistakes» eller sist.
import { scenario, scenarioNotat } from '../rik-sider.mjs';

export const ekstra = [
  ['How an Instagram recipe caption is usually built', '<p>Once you have read a few hundred captions, you notice that most follow the same loose shape. Knowing the shape makes it easy to spot, in a second, what is missing from the draft Matlyst builds.</p>'
    + '<ol><li><strong>A hook line.</strong> “The easiest weeknight pasta.” It is not part of the recipe, and it can safely end up in the description or be deleted.</li>'
    + '<li><strong>An ingredient list.</strong> Sometimes a tidy list, sometimes a run of lines with emoji bullets, sometimes one paragraph with commas. Long lists are often split into groups: sauce, filling, topping.</li>'
    + '<li><strong>The method.</strong> Numbered steps, or short paragraphs that read like steps. This is where oven temperature and time usually hide.</li>'
    + '<li><strong>Notes.</strong> “Serves 4,” “keeps 3 days in the fridge,” “swap the cream for coconut milk.” Useful, and easy to overlook.</li>'
    + '<li><strong>Hashtags and tags.</strong> Not part of the recipe at all.</li></ol>'
    + '<h3>What to look for in the draft</h3>'
    + '<p>Open the draft next to the post and check five things, in this order:</p>'
    + '<ul><li><strong>Ingredient groups.</strong> If the caption had “For the sauce” and “For the topping,” the same split should appear in the draft.</li>'
    + '<li><strong>Amounts.</strong> Every ingredient that needs a quantity should have one. “Salt” and “oil” often have none, because the creator wrote “to taste.”</li>'
    + '<li><strong>Oven temperature.</strong> Look for it in the steps. If the caption said 400°F, the step should say 400°F, not a rounded or missing number.</li>'
    + '<li><strong>Time.</strong> Minutes for baking, simmering, and resting. A missing time is a common gap.</li>'
    + '<li><strong>“To taste.”</strong> Seasoning with no amount is normal and not an error. The recipe is more useful if you add your own amount after you cook it once.</li></ul>'],

  ['Before you trust it: a ten-second checklist', '<p>The draft is a first pass. When you paste a link on the Add tab, you see the recipe before you tap <strong>Save recipe</strong>. When you share from Instagram, the recipe can be saved in the background, so you check it right after. Either way, run through this list once. After a few recipes it becomes automatic.</p>'
    + '<ul><li>Does the title say what the dish is, in words you would search for later?</li>'
    + '<li>Is every ingredient listed with an amount, or on purpose without one?</li>'
    + '<li>Do the number of servings and the amounts belong together? Scaling uses the servings number, so a wrong one throws off every quantity.</li>'
    + '<li>Are the steps in the order you would cook them, and is each one an action?</li>'
    + '<li>Are temperature and time written out in the step they belong to?</li>'
    + '<li>Is the recipe in a folder you will look in?</li>'
    + '<li>Is the source still attached, so you can go back to the post?</li></ul>'
    + '<p>If you can say yes to all seven, you are done. If one is a no, fix it now. It takes less time than it will take on a busy Tuesday when the pan is already hot.</p>'],

  ['The import came out wrong: what to do, step by step', '<p>Imports from captions are not perfect, and it is better to know the usual causes than to guess. Find your symptom below.</p>'
    + '<h3>The recipe came out half empty</h3>'
    + '<ol><li>Open the post in Instagram and scroll the caption to the end. Is the full recipe actually written there?</li>'
    + '<li>If part of it is in the first comment, Matlyst does not read comments. Copy the caption and the comment together, and paste them under <strong>Type it in</strong> on the Add tab, or add the missing lines to the imported recipe by hand.</li>'
    + '<li>If the recipe is behind a link in the creator’s bio, open the link. When it goes to a recipe page, share that page to Matlyst instead.</li>'
    + '<li>If the recipe is only in the video, add the amounts yourself after importing.</li></ol>'
    + '<h3>Amounts are missing</h3>'
    + '<p>First check whether the creator wrote them. If the caption has “1 cup rice” and the draft has “rice,” edit the line and add the cup. If the caption has no amount, there is nothing to import. Add your own after you cook it, and the recipe is better than the original.</p>'
    + '<h3>The steps are out of order, or there are too many</h3>'
    + '<p>Long captions sometimes mix a tip into the method. Read the steps from top to bottom as if you were cooking. Move a step to where it belongs, merge two small ones, or delete anything that is not an action.</p>'
    + '<h3>The language is wrong</h3>'
    + '<p>When a caption is in another language, Matlyst translates the recipe into the language you use the app in. Most of it reads naturally, but ingredient names can come out odd, especially regional ones. Compare any name you do not recognize with the post, and rename it to what your store calls it.</p>'
    + '<h3>It says the post cannot be read</h3>'
    + '<p>Matlyst needs a public post. If the post was deleted or made private, Matlyst cannot find it. If the creator has limited the post to viewing inside Instagram, the text cannot be read either. In both cases, copy the recipe text from the post and paste it under <strong>Type it in</strong>.</p>'
    + '<h3>There is more than one recipe in the post</h3>'
    + '<p>Matlyst makes one recipe per post. For a post with a main dish and a dessert, import once, then split the dessert into its own recipe by hand.</p>'],

  ['What can and cannot be imported from Instagram', '<p>Most confusion comes from expecting the app to see what you see. This table is the short version.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>Where the recipe is</th><th>Imported?</th><th>What to do</th></tr></thead><tbody>'
    + '<tr><td>In the caption of a post or reel</td><td>Yes</td><td>Share, read the draft, save.</td></tr>'
    + '<tr><td>In a carousel caption</td><td>Yes, from the caption text</td><td>Text written only on the slide images is not read.</td></tr>'
    + '<tr><td>Spoken in the video</td><td>No</td><td>Watch once and type the amounts.</td></tr>'
    + '<tr><td>Written on screen in the video</td><td>No</td><td>Pause and copy it by hand.</td></tr>'
    + '<tr><td>In a comment</td><td>No</td><td>Copy the comment and paste under <strong>Type it in</strong>.</td></tr>'
    + '<tr><td>Behind a link in the bio</td><td>Not from Instagram</td><td>Open the link and share that recipe page instead.</td></tr>'
    + '<tr><td>Several recipes in one post</td><td>One recipe per post</td><td>Split the others by hand.</td></tr>'
    + '<tr><td>Private or deleted post</td><td>Usually not</td><td>Paste the text yourself.</td></tr></tbody></table></div>'
    + '<p>One more thing the table cannot show: Matlyst saves the recipe and a link to the source. It does not download the video file.</p>'],

  ['Building a collection from Instagram without drowning', '<p>The goal is not to save more. It is to be able to find the right recipe at five o’clock on a weeknight. A small habit does most of the work.</p>'
    + '<h3>A weekly routine that takes ten minutes</h3>'
    + '<ol><li><strong>During the week,</strong> use Instagram’s own Save button freely. It costs nothing and keeps the pile in one place.</li>'
    + '<li><strong>Once a week,</strong> open your Saved tab and pick the two or three recipes you actually want to cook.</li>'
    + '<li><strong>Share only those</strong> to Matlyst, read each draft, and save.</li>'
    + '<li><strong>Put each one in a folder</strong> right away. Folders you will look in, such as Weeknight, Baking, or Guests, beat a perfect system you never open.</li></ol>'
    + '<p>This also fits the free plan, which includes 5 imports per calendar month. If you cook from Instagram a lot, Matlyst Pro adds more.</p>'
    + '<h3>Name recipes for how you will search</h3>'
    + '<p>A creator’s title is often a hook, like “The pasta that broke the internet.” Rename it to what you would type into search: “Baked feta pasta.” You can search by ingredient too, so the ingredient list does part of the work for you.</p>'
    + '<h3>Keep the collection small on purpose</h3>'
    + '<p>If a recipe has sat untouched for months, ask whether you will ever cook it. Delete it without guilt. The creator’s post is still on Instagram if you change your mind.</p>'],

  ['What if the creator deletes the post?', '<p>It happens. Accounts get closed, and creators remove posts. If you only bookmarked it, it is gone. If you imported it into Matlyst, the recipe you saved is still there: the ingredients, the steps, and any changes you made. What may stop working is the link back to the original post.</p>'
    + '<p>That is one of the main reasons to save the recipe itself and not just the post. It is also why the source badge matters. While the post exists, it lets you go back to the creator. When it does not, the recipe still stands on its own.</p>'],

  ['Respect the creator, and keep the source', '<p>A recipe in a caption is someone’s work. A few habits keep it fair.</p>'
    + '<ul><li><strong>Keep the source on the recipe.</strong> Matlyst attaches the link to the post and shows the creator’s handle when it can find it, or the platform name when it cannot. Do not remove it.</li>'
    + '<li><strong>Use it for cooking, not for reposting.</strong> A saved recipe is for your kitchen. If you want to share the dish, link to the original post.</li>'
    + '<li><strong>Credit your changes.</strong> If you change the recipe a lot, say so in <strong>My notes</strong> on the recipe. The next section shows how Matlyst marks an adapted copy.</li></ul>'],

  ['Adapt an imported recipe with Ask Matlyst', '<p>Saved recipes are not fixed. With <strong>Ask Matlyst</strong>, a Matlyst Pro feature that uses AI, you can ask for a change in plain words: make it vegan, cut the time, halve the amount of oil, or swap the pasta for rice.</p>'
    + '<ol><li>Open the saved recipe.</li>'
    + '<li>Open Ask Matlyst from the recipe and ask for the change you want.</li>'
    + '<li>Read the answer. It is a suggestion, and AI can make mistakes, especially with baking, where amounts depend on each other.</li>'
    + '<li>Choose <strong>Save a copy</strong>. The original stays as it was, and the copy keeps the source, marked “adapted.”</li></ol>'
    + '<p>Because the original is untouched, you can always compare the two. That makes it safe to try bolder changes. If you would rather overwrite your own recipe, choose <strong>Replace</strong> instead. Ask Matlyst has a monthly allowance, and the app tells you how many requests are left when you get close.</p>'],

  ['Five more situations', scenarioNotat()
    + scenario('Say the creator writes the ingredients as one paragraph', {
      situasjon: 'The caption lists everything separated by commas, with no line breaks.',
      galt: 'The draft may put two ingredients on one line, or lose the amount of one.',
      gjor: 'Read the ingredient list against the caption and split any line that holds two items.',
      tall: 'A recipe with 12 ingredients should have 12 lines. Count them.',
      matlyst: 'Edit the lines in the draft, then save.' })
    + scenario('Say the recipe is written in another language', {
      situasjon: 'You follow a creator who posts in Spanish, and you cook in English.',
      galt: 'A regional ingredient name is translated into something your store does not stock.',
      gjor: 'Look up the odd names, then rename them to what you can buy.',
      matlyst: 'Import, check the translated names, rename, and save.' })
    + scenario('Say the post is a carousel with the recipe on the slides', {
      situasjon: 'The method is written on the images, and the caption is only a greeting.',
      galt: 'Text inside images is not part of the caption, so it is not imported.',
      gjor: 'Type the recipe by hand, or take a screenshot of each slide and import the screenshots as photos (Pro).',
      matlyst: 'Tap <strong>Take photo</strong> on the Add tab, pick the screenshots from Photos (up to 20 at a time), and check the result. More in <a href="/en/import-recipes-from-photos/">import from photos</a>.' })
    + scenario('Say you want a lighter version', {
      situasjon: 'A creamy sauce recipe is perfect except for the amount of cream.',
      galt: 'You edit the quantities in your head and forget at the stove.',
      gjor: 'Ask for a lighter version, read it carefully, and keep it as a separate recipe.',
      matlyst: 'Ask Matlyst for the change and choose Save a copy.' })
    + scenario('Say a friend sends you a reel', {
      situasjon: 'A friend shares a dinner reel in a message, and you open it from there.',
      galt: 'The message thread buries it within a day.',
      gjor: 'Open the post and share it to Matlyst, or copy the link and use <strong>Paste a link</strong> on the Add tab.',
      matlyst: 'Share, read the draft, put it in a folder, and save.' })],

  ['Common misunderstandings', '<ul><li><strong>“It watches the video.”</strong> It does not. It reads the caption text. Speech, on-screen text, and music are not read.</li>'
    + '<li><strong>“It reads the comments.”</strong> It does not. A recipe pinned in a comment has to be copied over by you.</li>'
    + '<li><strong>“It downloads the reel.”</strong> It saves the recipe and a link to the source, not the video file.</li>'
    + '<li><strong>“Units are always kept as written.”</strong> That depends on <strong>Units</strong> in Settings. With Metric, cups, ounces, and pounds are converted to metric. With US, Matlyst keeps the source’s measurements. The setting applies to new imports.</li>'
    + '<li><strong>“AI means it is always right.”</strong> AI reads and translates the caption, and it can make mistakes. The draft step exists for that reason.</li>'
    + '<li><strong>“One post, many recipes.”</strong> One post becomes one recipe.</li></ul>'
    + '<p>If you are comparing ways to keep recipes at all, the guide to <a href="/en/blog/choose-recipe-organizer-app/">choosing a recipe organizer app</a> walks through what matters. To bring in recipes from websites too, see <a href="/en/import-recipes/">import recipes</a>.</p>'],
];
