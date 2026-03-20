import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

actor {
  let scores = Map.empty<Principal, Nat>();

  public query ({ caller }) func getPersonalBest() : async ?Nat {
    scores.get(caller);
  };

  public shared ({ caller }) func updatePersonalBest(attempts : Nat) : async () {
    switch (scores.get(caller)) {
      case (null) {
        scores.add(caller, attempts);
      };
      case (?currentBest) {
        if (attempts < currentBest) {
          scores.add(caller, attempts);
        } else {
          Runtime.trap("Score not better than current best.");
        };
      };
    };
  };
};
