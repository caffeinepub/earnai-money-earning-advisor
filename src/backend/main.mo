import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";

import OutCall "http-outcalls/outcall";

actor {
  public type Profile = {
    name : Text;
    monthlyGoal : Nat;
    currentBalance : Nat;
  };

  public type EarningStrategy = {
    title : Text;
    description : Text;
    category : Text;
    estimatedEarnings : Nat;
    difficulty : Text;
  };

  public type SideHustle = {
    title : Text;
    description : Text;
    category : Text;
    timeCommitment : Text;
  };

  public type SkillPath = {
    title : Text;
    description : Text;
    potentialEarnings : Nat;
  };

  public type EarningsRecord = {
    amount : Nat;
    source : Text;
    date : Int;
  };

  public type FinancialTip = {
    tip : Text;
  };

  module EarningStrategy {
    public func compareByTitle(a : EarningStrategy, b : EarningStrategy) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  module SideHustle {
    public func compareByTitle(a : SideHustle, b : SideHustle) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  module SkillPath {
    public func compareByTitle(a : SkillPath, b : SkillPath) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  let profiles = List.empty<(Principal, Profile)>();
  let strategies = List.empty<EarningStrategy>();
  let hustles = List.empty<SideHustle>();
  let skillPaths = List.empty<SkillPath>();
  let earnings = List.empty<(Principal, EarningsRecord)>();
  let financialTips = List.empty<FinancialTip>();

  public shared ({ caller }) func createProfile(name : Text, monthlyGoal : Nat) : async () {
    if (profiles.toArray().find(func((p, _)) { p == caller }) != null) {
      Runtime.trap("Profile already exists");
    };
    let profile : Profile = {
      name;
      monthlyGoal;
      currentBalance = 0;
    };
    profiles.add((caller, profile));
  };

  public query ({ caller }) func getProfile() : async ?Profile {
    profiles.toArray().find(func((p, _)) { p == caller }).map(func((_, prof)) { prof });
  };

  public shared ({ caller }) func updateBalance(amount : Nat) : async () {
    let updated = profiles.toArray().map(func((p, profile)) { if (p == caller) { (p, { profile with currentBalance = profile.currentBalance + amount }) } else { (p, profile) } });
    profiles.clear();
    profiles.addAll(updated.values());
  };

  public query ({ caller }) func getAllProfiles() : async [Profile] {
    profiles.toArray().map(func((_, prof)) { prof });
  };

  public query func getAllStrategies() : async [EarningStrategy] {
    strategies.toArray().sort(EarningStrategy.compareByTitle);
  };

  public query func getAllHustles() : async [SideHustle] {
    hustles.toArray().sort(SideHustle.compareByTitle);
  };

  public query func getAllSkillPaths() : async [SkillPath] {
    skillPaths.toArray().sort(SkillPath.compareByTitle);
  };

  public shared ({ caller }) func logEarnings(amount : Nat, source : Text) : async () {
    let record : EarningsRecord = {
      amount;
      source;
      date = Time.now();
    };
    earnings.add((caller, record));
  };

  public query ({ caller }) func getEarnings() : async [EarningsRecord] {
    earnings.toArray().filter(func((p, _)) { p == caller }).map(func((_, rec)) { rec });
  };

  public query func getAllFinancialTips() : async [FinancialTip] {
    financialTips.toArray();
  };

  public shared ({ caller }) func askAIAdvice(message : Text) : async Text {
    let apiKey = "YOUR_ACTUAL_GEMINI_API_KEY";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" # apiKey;
    let systemContext = "You are a money earning advisor AI.";
    let prompt = systemContext # " " # message;
    let body = "{
      \"contents\": [
        {
          \"parts\": [
            { \"text\": \"" # prompt # "\" }
          ]
        }
      ]
    }";
    await OutCall.httpPostRequest(url, [], body, transform);
  };

  let isSeeded = List.empty<Principal>();

  public shared ({ caller }) func seedData() : async () {
    if (isSeeded.contains(caller)) {
      Runtime.trap("Already seeded");
    };
    strategies.clear();
    hustles.clear();
    skillPaths.clear();
    financialTips.clear();

    strategies.add({
      title = "Freelance Writing";
      description = "Write articles and blog posts for clients.";
      category = "Writing";
      estimatedEarnings = 5000;
      difficulty = "Medium";
    });
    strategies.add({
      title = "Stock Photography";
      description = "Sell your photos to stock photo sites.";
      category = "Photography";
      estimatedEarnings = 3000;
      difficulty = "Easy";
    });

    hustles.add({
      title = "Dog Walking";
      description = "Offer dog walking services in your neighborhood.";
      category = "Pets";
      timeCommitment = "Flexible";
    });
    hustles.add({
      title = "Tutoring";
      description = "Help students with their studies online.";
      category = "Education";
      timeCommitment = "Part-time";
    });

    skillPaths.add({
      title = "Learn Web Development";
      description = "Become a web developer and build websites for clients.";
      potentialEarnings = 8000;
    });
    skillPaths.add({
      title = "Digital Marketing";
      description = "Offer digital marketing services to small businesses.";
      potentialEarnings = 6000;
    });

    financialTips.add({
      tip = "Set specific earning goals each month.";
    });
    financialTips.add({
      tip = "Track all your income sources.";
    });

    isSeeded.add(caller);
  };

  public query func isDataSeeded() : async Bool {
    isSeeded.size() > 0;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func addAll<T>(list : List.List<T>, array : [T]) {
    list.addAll(array.values());
  };
};
