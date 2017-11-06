My comments/advices about the project:

  The exercise of refactoring was interesting. The application itself was simple (list of products, its detail, buying one parfume) but its aim was to check the philsophy of the candidate:
  how he organizes the structures of his files, the way he codes, and also test his ability to read and understand a potential coworker's code, to refactor it. In other words, this exercises implied a lot of thinking. 

  Before receiving this technical test, I was more expecting working on front-end but after receiving the test, I noticed most of the js files was about backend files (jsFiles). So it means the candidate must have some knowledge about how the backend works (how to work with the routes, for instance). I was not very used to using ExpressJS that and I struggled some times, especially with: 

  - the statics files which explain why the images are not loaded when you are running the app. 

  - middleware : I know in the routes (products/product/cart), I should put the "auth" middleware so that it checked if the user is authentificated or not before letting him accessing the page (not authentificate, redirect to login page)

  I did not understand very well about one of my tasks : "show a better version of the pages List, View and Cart". I do not know exactly what "better" means. It can be about improving the design, making a better responsive (like on smartphone, it should be one product at a time). However, as it was a refactoring exercise, it meant I should not add new features because maybe my co-worker had a specific reason why he did his html/css in his own way, and modifying his code may have broken his work.

  I noticed one problem about the project: when you buy a perfume, the number of perfumes remains the same. It should have decreased.



My explanation about your choice of refactoring:


About folder architecture:

I assume this app (Chanel e-commerce website) had the following points :
- use of static templates
- intent to be a Single Page App style
- using REST to communicate data

For these reasons, I thought reorganizing the folder architecture based on the MVC Architecture made sense. On top of that, programers are familiar with this type of architecture, it is clean (you do not write logic in templates for example) and structured. 

For three views : View , List, Cart, I decided to use the REST conversion:
- localhost:3001/api/products : for the list of products
- localhost:3001/api/products/:id : for one specific product
- localhost:3001/api/cart/:id : buy one specific product



About ES6 (const/let, arrow function, import):

I used ES6, and I mainly used "import" instead of "require" because all 
my code was ES6. I also know babel transform "import" into "required"

I use 'strict' because javascript is permissive to some typo errors.

About gulp, I did not use 'import' but 'require' because I am not sure I can use ES6 without installing a package.



About SEO/Accessibility:

For a better navigation, there must be a breadcrumb trail.

I know I should have replaced CDN libraries (bootstrap, jquery, popperjs) by installing these packages via npm and loading them for SEO purpose (the loading page speed is taken into account in SEO). I put these script tag at the end of the page so that the HTML can appear first if the js files are big. 

I should have minified the JS (+sourcemap) into two files : vendor.js (merging all the js librairies) and bundle.js (merging my js files), and I should also have minified the CSS (we could also use SASS for nesting some classes to avoid repetitions).

There was a thing I found weird about this exercise. There was actually no main page (index.html). If we had an index.html, we would not have to load for each template:

<!DOCTYPE html>
 <html lang="en">
 <link rel="stylesheet" href="">
 <head>
   <meta charset="UTF-8">
   <title>Document</title>
 </head>
 <script src=""></script>
 <body>
 </body>
 </html> 



