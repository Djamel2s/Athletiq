import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { WorkoutProgram } from './WorkoutProgram.js';

/**
 * Un jour dans un programme (ex: "Push Day" dans PPL).
 * Contient la liste des exercices prévus avec sets/reps cibles.
 */
@Entity('program_days')
export class ProgramDay {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  programId!: number;

  @ManyToOne('WorkoutProgram', 'days', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'programId' })
  program!: WorkoutProgram;

  @Column({ type: 'varchar' })
  name!: string; // ex: "Push Day", "Legs", "Upper Body A"

  @Column({ type: 'int' })
  dayIndex!: number; // 0, 1, 2... ordre dans la semaine

  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Exercices du jour, stockés en JSON pour flexibilité.
   * Format: Array<{ exerciseName: string, sets: number, reps: string, restSeconds: number, notes?: string }>
   * ex: [{ exerciseName: "Bench Press", sets: 4, reps: "8-10", restSeconds: 120 }]
   */
  @Column({ type: 'jsonb', default: [] })
  exercises!: Array<{
    exerciseName: string;
    sets: number;
    reps: string; // "8-10", "5", "AMRAP"
    restSeconds: number;
    notes?: string;
  }>;
}
