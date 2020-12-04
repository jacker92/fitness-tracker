using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Tests.Mocks.Services
{
    public class MockRecipeService : Mock<IRecipeService>
    {
        public MockRecipeService MockGetById(Recipe recipe)
        {
            Setup(x => x.GetById(It.IsAny<int>()))
                .Returns(recipe);

            return this;
        }

        public MockRecipeService MockGetForUser(List<Recipe> recipes)
        {
            Setup(x => x.GetForUser(It.IsAny<string>(), It.IsAny<bool>()))
                .Returns(recipes);

            return this;
        }

        public MockRecipeService MockAddRecipe(RecipeListResponse response)
        {
            Setup(x => x.AddRecipe(It.IsAny<User>(), It.IsAny<EditRecipeRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }


        public MockRecipeService MockUpdateRecipe(RecipeListResponse response)
        {
            Setup(x => x.UpdateRecipe(It.IsAny<User>(), It.IsAny<EditRecipeRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockRecipeService MockDeleteRecipe(RecipeListResponse response)
        {
            Setup(x => x.DeleteRecipe(It.IsAny<User>(), It.IsAny<DeleteRecipeRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }
    }
}