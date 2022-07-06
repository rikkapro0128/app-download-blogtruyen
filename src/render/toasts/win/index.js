class toast {
  primary({ title, body, icon }) {
    new Notification(title || 'no-content', {
      icon: icon || 'assets/icons/blogtruyen-logo.ico',
      body: body || 'no-content',
    });
  }
}

export default new toast();
