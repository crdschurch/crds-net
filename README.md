Crossroads Media
==========

Media site for Crossroads.

You can find documentation of custom features and troubleshooting of common problems [in the wiki](https://github.com/crdschurch/crds-media/wiki).

Getting Started
----------

1. Clone the project.
2. Install Ruby 2.4.3. If you haven't installed Ruby, consider using [rbenv](https://github.com/rbenv/rbenv).
3. Install Ruby dependencies:

    ```
    $ bundle install
    ```

4. Clone crds-styles:

    ```
    $ git submodule init
    $ git submodule update
    ```

5. Install the other JavaScript dependencies:

    ```
    $ npm install
    ```

6. Add appropriate environment variables. Consider using [direnv](https://direnv.net/) to help manage environment variables.
7. Pull down content:

    ```
    $ bundle exec jekyll contentful
    ```

    You may want to limit content here so local builds don't take forever:
  
    ```
    $ bundle exec jekyll contentful --limit 50
    ```

8. Start the server:

    ```
    $ bundle exec jekyll serve
    ```

## Build Logs

Build logs output to `buildlogs.txt`

* **Local development:**  
  Log is located at `_site/buildlogs.txt`

* **Netlify Build**  
  The log can be found at `[DEPLOY_URL]/buildlog.txt` on any deploy preview
  * Example: __https://YOUR_PROJECT_NAME.netlify.com/buildlog.txt__

License
----------

This project is licensed under the [3-Clause BSD License](https://opensource.org/licenses/BSD-3-Clause).

