trigger BearAlertTopicAssignmentTrigger on TopicAssignment (after insert) {
    // Get FeedItem posts only
    Set<Id> feedIds = new Set<Id>();
    for (TopicAssignment ta : Trigger.new){
        //topicassignment object that is FeedItem
        if (ta.EntityId.getSObjectType().getDescribe().getName().equals('FeedItem')) {
            feedIds.add(ta.EntityId);
        }
    }
    // Load FeedItem bodies
    Map<Id,FeedItem> feedItems = new Map<Id,FeedItem>([SELECT Body FROM FeedItem WHERE Id IN :feedIds]);
    // Create messages for each FeedItem that contains the BearAlert topic
    List<String> messages = new List<String>();
    //only retrieve post with the topic name, BearAlert
    //filter the body message off html tags
    for (TopicAssignment ta : [SELECT Id, EntityId, Topic.Name FROM TopicAssignment WHERE Id IN :Trigger.new AND Topic.Name = 'BearAlert']) {       
        messages.add(feedItems.get(ta.EntityId).body.stripHtmlTags().abbreviate(255));
    }
    // Create list instance of platform event, Notification__e
    //assign the above message onto the plaform events' custom field, message__c
    List<Notification__e> notifications = new List<Notification__e>();
    for (String message: messages) {
        notifications.add(new Notification__e(Message__c = message));
    }
    //publish the event
    List<Database.SaveResult> results = EventBus.publish(notifications);
    // Inspect publishing results
    for (Database.SaveResult result : results) {
        if (!result.isSuccess()) {
            for (Database.Error error : result.getErrors()) {
                System.debug('Error returned: ' + error.getStatusCode() +' - '+ error.getMessage());
            }
        }
    }
}
