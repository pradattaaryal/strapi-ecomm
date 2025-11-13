export default {
  routes: [
    {
      method: 'POST',
      path: '/newsletter/send',
      handler: 'news-letter-subscription.sendNewsletter',
      config: {
        auth: false,
        description: 'Send newsletter to all subscribed users using an email template',
        policies: [],
      },
    },
     

  ],
};
