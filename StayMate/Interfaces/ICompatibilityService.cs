using StayMate.Models;

namespace StayMate.Interfaces
{
    public interface ICompatibilityService
    {
        Task<int> CalculateCompatibilityAsync(int userId1, int userId2);
    }
}
