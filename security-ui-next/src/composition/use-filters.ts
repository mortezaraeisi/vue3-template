import { currentDate, currentDateTime } from '../utils/date-time';

function stringHelper(input?: string | object) {
  if (!input) {
    return '-';
  }
  if (typeof input === 'string') {
    return input;
  }
  return null;
}


export function user(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  return `${ input.firstName || '-' } ${ input.lastName || '-' } (${ input.username || '-' })`;
}

export function group(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  return `${ input.name }/${ input.title }`;
}

export function role(input: any) {
  return group(input);
}

export function workspace(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  return `${ input.name || '-' }/${ input.title || '-' }`;
}

export function resource(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  return `${ input.type || '-' }/(${ input.title || '-' })`;
}

export function domain(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  return `${ input.name || '-' }/(${ input.code || '-' })`;
}

export function date(input: any) {
  if (!input) {
    return '-';
  }
  return currentDate(input);
}

export function datetime(input: any) {
  if (!input) {
    return '-';
  }
  return currentDateTime(input);
}

export function localDate(input: any) {
  if (!input) {
    return '-';
  }
  const dateValue = typeof input === 'string' ? new Date(input) : input;
  const y = dateValue.getFullYear();
  const m = (dateValue.getMonth() + 1).toString().padStart(2, '0');
  const d = dateValue.getDate().toString().padStart(2, '0');
  return `${ y }-${ m }-${ d }`;
}

export function grid(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  const output = input.title || input.name || '-';
  if (input.workspace) {
    return `${ output } (${ input.workspace.title || input.workspace.name || '-' })`;
  }
  return output;
}

export function mobile(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue.replace(/^\+98/, '0');
  }
  return stringValue;
}


export function jobLocation(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  return input.name || '-';
}

export function apiKey(input: any) {
  const stringValue = stringHelper(input);
  if (stringValue) {
    return stringValue;
  }
  return input.ConsumerName || '-';
}


export function useFilters() {

  function getByName(name: string) {
    switch (name) {
      case'user':
        return user;
      case  'group':
        return group;
      case  'role':
        return role;
      case  'date':
        return date;
      case  'datetime':
        return datetime;
      case  'grid':
        return grid;
      case  'domain':
        return domain;
      case  'mobile':
        return mobile;
      case  'resource':
        return resource;
      case  'workspace':
        return workspace;
      case  'localDate':
        return localDate;
      case  'jobLocation':
        return jobLocation;
      case  'apiKey':
        return apiKey;
      default:
        throw new Error(`filter by name not found [${ name }]`);
    }
  }

  return {
    getByName,
    user,
    group,
    role,
    date,
    grid,
    domain,
    mobile,
    resource,
    workspace,
    localDate,
    jobLocation,
    apiKey,
    datetime,
  };
}
