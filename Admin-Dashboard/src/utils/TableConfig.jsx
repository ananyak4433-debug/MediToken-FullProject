export const userFeedback = {
  keys: ['createdOn', 'createdUser', 'comments'],
  config: {
    createdOn: {
      label: 'Created Date',
      type: 'date',
      class: ' commonDesc'
    },
    createdUser: {
      label: 'Created By',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    },
    comments: {
      label: 'Comment',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    }
  }
};

export const userRating = {
  keys: ['facilityTitle', 'comments', 'starRating'],
  config: {
     facilityTitle: {
      label: 'Facility Title',
      type: 'string',
      class: ' commonDesc'
    },
    comments: {
      label: 'Comment',
      type: 'string',
      class: 'cmn_Cap commonDesc'
    },
    starRating: {
      label: 'Rating', 
      type: 'number',
      class: 'cmn_Cap commonDesc'
    }
  }
};
  

export const facilityHeads = {
  keys: ['title', 'facilityType','createdUser','createdOn', 'avgStarRating','status'],
  config: {
    title: {
      label: 'Title',
      type: 'string',
      class: ' commonDesc'
    },
    facilityType: {
      label: 'Facility Type',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    },
    createdUser:{
      label:"Created By",
      type:'string',
      class: ' cmn_Cap commonDesc'
    },
      avgStarRating: {
      label: 'Rating', 
      type: 'string',
      class: 'cmn_Cap commonDesc'
    },
     status:{
      label: 'Status',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    },
    createdOn:{
      label: 'Created On',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    }
  }
};

export const usersHeads = {
  keys: ['fullName',  'email','role','appVersion','status'],
  config: {
    fullName: {
      label: 'Name',
      type: 'string',
      class: ' commonDesc'
    },
    
    email: {
      label: 'Email',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    },
    role:{
       label: 'Role',
       type: 'string',
       class: ' cmn_Cap commonDesc'
    },
     appVersion:{
       label: 'App Version',
       type: 'string',
       class: ' cmn_Cap commonDesc'
    },
    status:{
      label: 'Status',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    }
  }
};

export const userReport = {
  keys: ['issueId','facilityTitle', 'reportedByName', 'topic', 'priority', 'status'],
  config: {
    issueId: {
      label: 'Issue ID',
      type: 'string',
      class: ' commonDesc'
    },
     facilityTitle: {
      label: 'Facility Title',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    },
    reportedByName: {
      label: 'Reported By',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    },
    topic: {
      label: 'Issue',
      type: 'string',
      class: ' cmn_Cap commonDesc'
    },
    // priority: {
    //   label: 'Priority',
    //   type: 'string',
    //   class: ' cmn_Cap commonDesc'
    // },
    status:{
      label: 'Status',
      type: 'string',
      // class: ' cmn_Cap commonDesc'
    
    }
  }
};

