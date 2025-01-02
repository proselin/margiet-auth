import { ICredentials } from '../types';
import { Column } from 'typeorm';

export class Credentials implements ICredentials {
  @Column({ type: 'int', default: 0 })
  version: number;

  @Column({ type: 'timestamp' })
  passwordUpdatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastConfirmedAt: number;
}
