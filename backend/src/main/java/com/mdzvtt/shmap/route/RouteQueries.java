package com.mdzvtt.shmap.route;

public final class RouteQueries {
    private static final String IS_DONE = "r.completion.finishedOn is not null";

    private static final String IS_PARTICIPANT = """
            exists (select 1 from r.participants p where p.id = :viewerId)""";

    private static final String BLOCKED_WITH_PARTICIPANT = """
            exists (
                select 1 from UserBlock b
                where (b.blocker.id = :viewerId
                        and b.blocked.id in (select p.id from r.participants p))
                   or (b.blocked.id = :viewerId
                        and b.blocker.id in (select p.id from r.participants p))
            )""";

    private static final String ALLOWS_OUTSIDERS = """
            r.completion.visibility <> com.mdzvtt.shmap.route.RouteVisibility.PARTICIPANTS""";

    private static final String FRIEND_OF_PARTICIPANT = """
            exists (
                select 1 from Friendship f
                where f.user.id = :viewerId
                  and f.friend.id in (select p.id from r.participants p)
            )""";

    private static final String HAS_PRIVATE_PARTICIPANT = """
            exists (select 1 from r.participants p where p.privateAccount = true)""";

    private static final String OPEN_TO_EVERYONE = "r.completion.visibility = com.mdzvtt.shmap.route.RouteVisibility.EVERYONE"
            + " and not " + HAS_PRIVATE_PARTICIPANT;

    public static final String VISIBLE_TO_VIEWER = IS_DONE
            + " and (" + IS_PARTICIPANT
            + " or (not " + BLOCKED_WITH_PARTICIPANT
            + " and " + ALLOWS_OUTSIDERS
            + " and (" + FRIEND_OF_PARTICIPANT
            + " or (" + OPEN_TO_EVERYONE + "))))";

    private RouteQueries() {
    }
}
