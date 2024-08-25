# Fixing Your Git Commit History: Correcting the Chaos

**Truth Meter: ⭐⭐⭐⭐⭐**

So, you've checked into your git repo with a mix of correct and incorrect email addresses and names. Sometimes you were on point, and other times, well, not so much. But no worries—since you’re the only committer in this repo, it’s time to clean up that history and make everything right.

### Step 1: Check Your Commit History
Before diving into the cleanup, let’s see where things went off the rails. To view your commit history, use:

```bash
git log --pretty=full
```

This will display the full commit history with author and committer details. You’ll spot the inconsistent entries in no time.

### Step 2: Rewriting History with `git filter-branch`
To correct those entries, we’ll use the trusty `git filter-branch`. Sure, it’s a bit old-school and comes with warnings, but it’s still a favorite for a reason. We’re going to rewrite history, but only if the name or email isn’t already correct.

Here’s the magic command:

```bash
git filter-branch --env-filter '
CORRECT_NAME="Your Correct Name"
CORRECT_EMAIL="correct-email@example.com"

if [ "$GIT_COMMITTER_NAME" != "$CORRECT_NAME" ] || [ "$GIT_COMMITTER_EMAIL" != "$CORRECT_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_NAME" != "$CORRECT_NAME" ] || [ "$GIT_AUTHOR_EMAIL" != "$CORRECT_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

This script checks each commit and updates the name and email if they don’t match your correct details. It’s like a lint roller for your git history, picking up all those pesky errors.

### Step 3: Force Push Your Changes
After you’ve cleaned up the history, it’s time to push those changes to the remote repository. **Proceed with caution**—force pushing will overwrite the commit history on the remote, so make sure you’re ready for that.

```bash
git push --force origin main
```

And just like that, your repo is as spotless as a fresh coat of paint.

### Conclusion
Correcting your git commit history is easier than it sounds, especially when you’re the sole committer. With `git filter-branch`, you can rewrite history to reflect the real you, all while keeping things light and breezy. Just remember to double-check your changes before force pushing.

Give it a whirl in a test repo first if you’re nervous. And if you found this helpful, don’t forget to click that "Follow" link at the top of the page to stay in the loop with more tips and tricks!