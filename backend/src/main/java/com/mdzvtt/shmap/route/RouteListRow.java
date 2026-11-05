package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.user.User;

public record RouteListRow(Route route, User createdBy, Integer stopCount) {
}
