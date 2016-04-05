frontend nanodegree neighbourhood map
===============================

How to run the application
--------------------------
In order to run the application all you need to do is to open website.html in your web browser (it must be a browser able to run javascript and support html5).
There is no need to host it in a local or remote web server.

How to search locations
--------------------
There is a textbox in the top left of the window. When you type the locations (shown on the sidebar) will be filtered.

Extra data
--------------------
In order to see additional data just click in the list in the sidebar and it will load images related to the place from Flickr.

Development Info
----------------
My JS code is in one file: app.js.

a. MapController Class
This class controls the map and interacts with it.

b. Search Model
This is the model used to bind the data with the DOM using knockoutJS.

c. Flickr class
This is a static class that connects to flickr and loads the images in the search model.