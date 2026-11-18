// Ekstra seksjoner (1,5 ganger-regelen). Liste av [H2, HTML]. Settes inn før «Common mistakes» eller sist.
import { scenario, scenarioNotat } from '../rik-sider.mjs';

export const ekstra = [
  ['Why TikTok captions are different', '<p>An Instagram caption can run to a page. A TikTok caption is short, and a lot of the recipe lives somewhere else: in the voice-over, in text laid over the video, or in a pinned comment. That changes what you can expect from an import.</p>'
    + '<ul><li><strong>Short captions are normal.</strong> A caption like “Garlic butter shrimp, 10 minutes” holds a title and nothing else. There is nothing more to read.</li>'
    + '<li><strong>Text on the screen is not caption text.</strong> The words that pop up while the creator cooks belong to the video. Matlyst does not read them.</li>'
    + '<li><strong>The recipe may be in a comment.</strong> Creators often pin the full recipe there. Matlyst does not read comments.</li>'
    + '<li><strong>Some creators write the whole recipe in the caption.</strong> Those import well, and they are the ones to look for.</li></ul>'
    + '<p>A quick test before you share: open the caption and tap to expand it. If you can see ingredients with amounts there, the import has something to work with.</p>'],

  ['What can and cannot be imported from TikTok', '<div class="table-wrap"><table><thead><tr><th>Where the recipe is</th><th>Imported?</th><th>What to do</th></tr></thead><tbody>'
    + '<tr><td>Written in the caption</td><td>Yes</td><td>Share, read the draft, save.</td></tr>'
    + '<tr><td>Spoken in the video</td><td>No</td><td>Watch, then type the amounts you hear.</td></tr>'
    + '<tr><td>Text shown on the screen</td><td>No</td><td>Pause and copy it by hand.</td></tr>'
    + '<tr><td>In a comment</td><td>No</td><td>Copy the comment and paste it under <strong>Type it in</strong>.</td></tr>'
    + '<tr><td>Link in the creator’s bio</td><td>Not from TikTok</td><td>Open the link and share that recipe page.</td></tr>'
    + '<tr><td>Several recipes in one video</td><td>One recipe per video</td><td>Split the rest by hand.</td></tr>'
    + '<tr><td>A short link (vm.tiktok.com, vt.tiktok.com, tiktok.com/t/)</td><td>Yes</td><td>Share or paste it as it is.</td></tr></tbody></table></div>'
    + '<p>Matlyst keeps the recipe and a link to the source video. It does not download the video itself.</p>'],

  ['Check it right away: a short checklist', '<p>Because TikTok captions are brief, the draft is often short too. That makes the check quick. If you paste the link on the Add tab, you see the recipe before you tap <strong>Save recipe</strong>. If you share from TikTok, check it right after it is saved.</p>'
    + '<ol><li><strong>Is every ingredient there?</strong> Watch the video once with the list beside you and tick them off.</li>'
    + '<li><strong>Do the amounts exist?</strong> If not, decide whether to add your own now or after cooking it once.</li>'
    + '<li><strong>Are the steps complete?</strong> A one-line caption may give you only two steps. Add the ones the video shows.</li>'
    + '<li><strong>Temperature and time.</strong> Creators often say them out loud. Type them into the step.</li>'
    + '<li><strong>Servings.</strong> Set the number of servings, so scaling works later.</li>'
    + '<li><strong>Folder and title.</strong> Rename the title to what you would search for.</li></ol>'],

  ['The import came out wrong: what to do', '<h3>The recipe has a title and almost nothing else</h3>'
    + '<p>The caption is probably short, with the real recipe in the video or a comment. Watch the video, then add the ingredients and steps yourself. The source link stays on the recipe, so you can return to the video.</p>'
    + '<h3>Amounts are missing</h3>'
    + '<p>Check the caption first. If the creator wrote “butter” and no amount, the draft will too. Add a quantity from the video, or write your own after you cook it once.</p>'
    + '<h3>The steps look jumbled</h3>'
    + '<p>Short captions are sometimes written as one run-on line. Read the steps as if you were cooking, then reorder, split, or delete them until they make sense.</p>'
    + '<h3>The link will not import</h3>'
    + '<p>Check that the video is public and still exists. Short links work, but a deleted or private video cannot be read. If the video is gone, paste any text you copied under <strong>Type it in</strong>.</p>'
    + '<h3>The words look translated oddly</h3>'
    + '<p>If the caption was in another language, Matlyst translates the recipe into the language you use the app in. Check ingredient names you do not recognize and rename them to what you can buy.</p>'],

  ['Keep a TikTok recipe collection you will actually use', '<p>TikTok is a fast feed, and Favorites fills up quickly. A short weekly habit keeps your Matlyst collection useful.</p>'
    + '<ol><li><strong>Favorite freely</strong> during the week. It is quick and costs nothing.</li>'
    + '<li><strong>Once a week,</strong> go through Favorites and pick the two or three you will really cook.</li>'
    + '<li><strong>Import only those,</strong> read each draft, and save.</li>'
    + '<li><strong>Use a few folders,</strong> such as Weeknight, Snacks, and Guests, and rename titles to words you would search for.</li></ol>'
    + '<p>The free plan includes 5 imports per calendar month, so picking the best few also fits it. Matlyst Pro adds more. You can search a saved recipe by ingredient, which a feed of favorites cannot do.</p>'
    + '<p>When a creator deletes a video, a Favorite disappears with it. A recipe you imported stays in Matlyst, with the ingredients, the steps, and your own changes. Only the link back to the original may stop working.</p>'],

  ['Respect the creator, and make the recipe your own', '<p>Matlyst keeps a link to the original video on every recipe saved from TikTok, and shows the creator’s handle when it can find it. Leave it there. It lets you go back for more from the same creator, and it keeps credit where it belongs.</p>'
    + '<p>If you want to change a recipe, <strong>Ask Matlyst</strong> (Pro, uses AI) can suggest a version that is vegan, quicker, or smaller. Read the suggestion, because AI can make mistakes, especially with baking. Choose <strong>Save a copy</strong>, and the original stays untouched while the copy keeps the source, marked “adapted.”</p>'],

  ['More situations', scenarioNotat()
    + scenario('Say the caption is only a title and some hashtags', {
      situasjon: 'The video is a 20 second pasta, and the caption reads “Cozy dinner #pasta.”',
      galt: 'The draft has a title and no ingredients, because there is nothing to read.',
      gjor: 'Watch the video, then type the ingredients and steps.',
      matlyst: 'Import for the title and source, add the rest, and save.' })
    + scenario('Say the recipe is pinned in a comment', {
      situasjon: 'The creator wrote the full recipe in the first comment.',
      galt: 'Matlyst does not read comments, so the draft is empty.',
      gjor: 'Copy the comment text.',
      matlyst: 'Paste it under <strong>Type it in</strong>, check it, and save.' })
    + scenario('Say you only have a short link', {
      situasjon: 'A friend sent you a link that starts with vm.tiktok.com.',
      galt: 'You assume short links will not work.',
      gjor: 'Paste it as it is. Short links are supported.',
      matlyst: 'Open the Add tab, choose <strong>Paste a link</strong>, tap <strong>Get recipe</strong>, and read the draft.' })
    + scenario('Say you want to cook it tonight', {
      situasjon: 'You saved a recipe and want to follow it with messy hands.',
      galt: 'You keep unlocking your phone to scroll the steps.',
      gjor: 'Tap Start cooking. Cook mode shows the steps as a checklist with suggested timers, and keeps the screen awake.',
      tall: 'Cook mode needs an internet connection.',
      matlyst: 'Open the recipe and start cook mode.' })],

  ['Common misunderstandings', '<ul><li><strong>“It listens to the video.”</strong> It does not. It reads the caption, not speech or on-screen text.</li>'
    + '<li><strong>“It reads the comments.”</strong> It does not.</li>'
    + '<li><strong>“It saves the video.”</strong> It saves the recipe and a link, not the file.</li>'
    + '<li><strong>“Short links will not work.”</strong> vm.tiktok.com, vt.tiktok.com, and tiktok.com/t/ links work.</li>'
    + '<li><strong>“The draft is always right.”</strong> AI can make mistakes. Read it before you cook.</li></ul>'
    + '<p>Need a place to put all of it? See the <a href="/en/recipe-book-app/">recipe organizer app</a> overview, or plan the week in the <a href="/en/meal-plan-app/">meal plan</a> and the <a href="/en/shopping-list/">grocery list</a>.</p>'],
];
