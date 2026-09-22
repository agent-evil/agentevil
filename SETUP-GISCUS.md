# Connect the return channel

Comments remain honestly disconnected until all four public settings are supplied. The site works without them. No GitHub token belongs in client configuration.

1. Enable Discussions on a public GitHub repository you control.
2. Install the [giscus app](https://github.com/apps/giscus) on that repository.
3. Use [giscus configuration](https://giscus.app/) to obtain the repository and category IDs. Choose an announcements category if only giscus should create discussions.
4. Copy `.env.example` to a local `.env` and fill `PUBLIC_GISCUS_REPO` (`owner/repository`), `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY` and `PUBLIC_GISCUS_CATEGORY_ID`. These are public identifiers, not credentials. For CI, set the same names as GitHub repository variables; the build step reads them.
5. Rebuild with `bun run build`. On an article, choose “Connect GitHub comments”. Inspect the actual discussion after posting a test comment yourself.

All languages of an article share the stable discussion term `posts/<slug>`. The interface language follows the URL and the color scheme follows the console. No giscus request happens until the reader presses the connection button. An unavailable script allows retry; privacy details appear before loading.

The live GitHub integration cannot be verified until the owner supplies these public IDs and configures the app. Configure allowed domains in the repository's `giscus.json` if desired; include the production domain and any preview domains you intend to use. See [giscus advanced usage](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md).
