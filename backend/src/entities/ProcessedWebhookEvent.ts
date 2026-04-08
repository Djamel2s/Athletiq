import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('processed_webhook_events')
export class ProcessedWebhookEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  eventId!: string;

  @Column({ type: 'varchar', length: 64 })
  provider!: string;

  @CreateDateColumn()
  processedAt!: Date;
}
