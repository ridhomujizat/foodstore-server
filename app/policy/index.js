const { AbilityBuilder, Ability } = require("@casl/ability");

const policies = {
  guest(user, { can }) {
    can("read", "Product");
  },
  user(user, { can }) {
    can("view", "order");
    can("create", "order");
    can("read", "order", { user_id: user._id });
    can("update", "user", { _id: user._id });
    can("read", "Cart", { user_id: user._id });
    can("update", "Cart", { user_id: user.id });
    can("view", "DeliveryAddress");
    can("create", "DeliveryAddress", { user_id: user._id });
    can("read", "DeliveryAddress", { user_id: user._id });
    can("update", "DeliveryAddress", { user_id: user._id });
    can("delete", "DeliveryAddress", { user_id: user._id });
    can("read", "Invoice", { user_id: user._id });
  },
  admin(user, { can }) {
    can("manage", "all");
  },
};

function policyFor(user) {
  let builder = new AbilityBuilder();

  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, builder);
  } else {
    policies["guest"](user, builder);
  }

  return new Ability(builder.rules);
}

module.exports = {
  policyFor,
};
