using System.Security.Claims;

namespace StayMate.Helpers
{
    public static class ControllerHelper
    {
        public static int GetCurrentUserId(ClaimsPrincipal user)
        {
            var userIdStr = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return userId;
        }

        public static string GetCurrentUserIdString(ClaimsPrincipal user)
        {
            var userIdStr = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return userIdStr;
        }

        public static bool IsUserInRole(ClaimsPrincipal user, string role)
        {
            return user.IsInRole(role);
        }
    }
}
