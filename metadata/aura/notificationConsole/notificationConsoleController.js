/*Part - 1
({
    onInit: function (component, event, helper) {
      //stores the notifications list with values of fields, time and message
      component.set('v.notifications', [
        { time: '00:01', message: 'Greetings Trailblazer!' },
        { time: '00:02', message: 'Congratulations on building this first version of the app.' },
        { time: '00:03', message: 'Beware of the bears.' }
      ]);
      helper.displayToast(component, 'success', 'Ready to receive notifications.');
    },
    //set the notification list to empty
    onClear: function (component, event, helper) {
      component.set('v.notifications', []);
    },
    
    onToggleMute: function (component, event, helper) {
      const isMuted = component.get('v.isMuted');
      //component's variable isMuted set to True
      component.set('v.isMuted', !isMuted);
      //calls the helper function to display the toast message
      helper.displayToast(component, 'success', 'Notifications ' + ((!isMuted) ? 'muted' : 'unmuted') + '.');
    }
  })
  */
 //Part-2
 ({
    // Called when the component is initialized.
    // Subscribes to the channel and displays a toast message.
    // Specifies an error handler function for empApi   
    onInit: function (component, event, helper) {
      component.set('v.subscription', null);
      component.set('v.notifications', []);
      // Get empApi component.
      const empApi = component.find('empApi');
      // Define an error handler function that prints the error to the console.
      const errorHandler = function (message) {
        console.error('Received error ', JSON.stringify(message));
      };
      // Register empApi error listener and pass in the error handler function.
      empApi.onError($A.getCallback(errorHandler));
      // subscribes to the platform event channel by calling the helper subscribe() function.
      helper.subscribe(component, event, helper);
      helper.displayToast(component, 'success', 'Ready to receive notifications.');
    },
    // Clear notifications in console app.
    onClear: function (component, event, helper) {
      component.set('v.notifications', []);
    },
    // Mute toast messages and unsubscribe/resubscribe to channel.
    onToggleMute: function (component, event, helper) {
      const isMuted = !(component.get('v.isMuted'));
      component.set('v.isMuted', isMuted);
      if (isMuted) {
        helper.unsubscribe(component, event, helper);
      } else {
        helper.subscribe(component, event, helper);
      }
      helper.displayToast(component, 'success', 'Notifications ' +
        ((isMuted) ? 'muted' : 'unmuted') + '.');
    }
  })
  
  
