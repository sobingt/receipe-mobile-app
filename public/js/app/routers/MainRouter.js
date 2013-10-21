define([
    'backbone',
    'app/views/RecipesListView',
    'app/views/RecipeDetailsView',
    'app/views/HeaderView',
    'app/views/HomeHeaderView',
    'app/views/FooterView',
    'app/views/JqmPageView',
    'app/models/Recipe'
], function (Backbone, RecipesListView, RecipeDetailsView, HeaderView,
             HomeHeaderView, FooterView, jqMPageView, Recipe) {
    var Router = Backbone.Router.extend({
        initialize: function() {

            // Handle back button throughout the application
            $(document).on('click', '[data-rel="back"]', function(event) {
                window.history.back();
                return false;
            });
        },

        routes: {
            'recipes(/q=:q)(/p=:p)(/)': 'getRecipes',
            'recipes/:id': 'getRecipe',
            '': 'main'
        },

        main: function () {
            this.navigate('recipes', { trigger: true });
        },

        getRecipe: function(id) {
            $.mobile.loading( 'show' );
            var rModel = new Recipe.model({
                id: id
            });

            rModel.fetch({
                success: function(model, response, options) {
                    var recipePage = new jqMPageView();
                    recipePage.setHeaderView(new HeaderView({
                        model: model
                    }), true);
                    recipePage.setContentView(new RecipeDetailsView({
                        model: model
                    }));
                    recipePage.setFooterView();
                    recipePage.navigate('slide');
                    $(document).scrollTop();
                }
            });
        },

        getRecipes: function (q, p) {
            console.log('q: ' + q + ' p: ' + p);
            
            $.mobile.loading( 'show' );
            var rCollection = new Recipe.collection({
                q: q,
                p: p
            });
			console.log("Collection");
			console.log(rCollection);

            var recipesPage = new jqMPageView();
            recipesPage.setHeaderView(new HomeHeaderView());
            recipesPage.setContentView(new RecipesListView({
                collection: rCollection
            }));
            recipesPage.setFooterView(new FooterView());
            rCollection.fetch({
                reset: true,
                success: function(collection, response, options) {
                    collection.sort();
                    recipesPage.navigate();
                }
            });
        }
    });

    return Router;
});