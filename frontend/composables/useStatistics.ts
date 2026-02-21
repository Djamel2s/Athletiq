import type { Workout } from '~/types/workout'
import type { OverviewStats, ChartData, ExerciseStats, PersonalRecord, TimeRange, WeekComparison } from '~/types/statistics'

export function useStatistics(workouts: Ref<Workout[]>, timeRange: Ref<TimeRange>, selectedExercise?: Ref<string | null>) {
  // Filter workouts by date range
  const filteredWorkouts = computed(() => {
    if (!timeRange.value) return workouts.value

    const now = new Date()
    const cutoffDate = new Date(now.getTime() - timeRange.value * 24 * 60 * 60 * 1000)

    return workouts.value.filter(w => {
      if (!w.completedAt) return false
      const workoutDate = new Date(w.completedAt)
      return workoutDate >= cutoffDate
    })
  })

  // Calculate overview stats
  const overviewStats = computed((): OverviewStats => {
    const total = filteredWorkouts.value.length
    const totalVolume = filteredWorkouts.value.reduce((sum, w) => sum + (w.totalVolume || 0), 0)
    const totalTime = filteredWorkouts.value.reduce((sum, w) => sum + (w.duration || 0), 0)
    const averageDuration = total > 0 ? Math.round(totalTime / total) : 0
    const currentStreak = calculateStreak(workouts.value)

    return {
      totalWorkouts: total,
      totalVolume: Math.round(totalVolume),
      totalTime,
      averageDuration,
      currentStreak
    }
  })

  // Calculate current streak (consecutive days with workouts)
  function calculateStreak(allWorkouts: Workout[]): number {
    if (allWorkouts.length === 0) return 0

    const sortedWorkouts = [...allWorkouts]
      .filter(w => w.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

    if (sortedWorkouts.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const workoutDates = new Set(
      sortedWorkouts.map(w => {
        const d = new Date(w.completedAt!)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    // Check if there's a workout today or yesterday
    const today = currentDate.getTime()
    const yesterday = currentDate.getTime() - 24 * 60 * 60 * 1000

    if (!workoutDates.has(today) && !workoutDates.has(yesterday)) {
      return 0
    }

    // Start counting from today or yesterday
    let checkDate = workoutDates.has(today) ? today : yesterday

    while (workoutDates.has(checkDate)) {
      streak++
      checkDate -= 24 * 60 * 60 * 1000
    }

    return streak
  }

  // Get volume over time for line chart
  const volumeData = computed((): ChartData => {
    const grouped = groupByDate(filteredWorkouts.value)
    const labels: string[] = []
    const data: number[] = []

    // Sort by date
    const sortedEntries = Array.from(grouped.entries()).sort((a, b) =>
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    )

    sortedEntries.forEach(([date, workoutList]) => {
      labels.push(formatDate(date))
      const totalVolume = workoutList.reduce((sum, w) => sum + (w.totalVolume || 0), 0)
      data.push(Math.round(totalVolume))
    })

    return {
      labels,
      datasets: [{
        label: 'Volume (kg)',
        data,
        borderColor: '#b8a48f',
        backgroundColor: 'rgba(184, 164, 143, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    }
  })

  // Get workout frequency by day of week
  const frequencyData = computed((): ChartData => {
    const dayCount = new Array(7).fill(0)
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

    filteredWorkouts.value.forEach(w => {
      if (w.completedAt) {
        const dayOfWeek = new Date(w.completedAt).getDay()
        dayCount[dayOfWeek]++
      }
    })

    return {
      labels: dayNames,
      datasets: [{
        label: 'Nombre d\'entraînements',
        data: dayCount,
        backgroundColor: '#d4c4b0',
        borderColor: '#b8a48f',
        borderWidth: 1
      }]
    }
  })

  // Get volume by muscle group
  const muscleGroupData = computed((): ChartData => {
    const muscleGroupVolume: Record<string, number> = {}

    filteredWorkouts.value.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const muscleGroup = exercise.exerciseLibrary?.primaryMuscle || 'Autre'
        const exerciseVolume = exercise.sets?.reduce((sum, set) => {
          return sum + (set.weight || 0) * (set.reps || 0)
        }, 0) || 0

        muscleGroupVolume[muscleGroup] = (muscleGroupVolume[muscleGroup] || 0) + exerciseVolume
      })
    })

    // Sort by volume descending
    const sorted = Object.entries(muscleGroupVolume)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8) // Top 8 muscle groups

    return {
      labels: sorted.map(([name]) => name),
      datasets: [{
        label: 'Volume (kg)',
        data: sorted.map(([, volume]) => Math.round(volume)),
        backgroundColor: '#d4c4b0',
        borderColor: '#b8a48f',
        borderWidth: 1
      }]
    }
  })

  // Get exercise distribution for doughnut chart
  const exerciseDistributionData = computed((): ChartData => {
    const exerciseCounts: Record<string, number> = {}

    filteredWorkouts.value.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const name = exercise.exerciseLibrary?.name || exercise.name
        exerciseCounts[name] = (exerciseCounts[name] || 0) + 1
      })
    })

    // Get top 5 + others
    const sorted = Object.entries(exerciseCounts)
      .sort((a, b) => b[1] - a[1])

    const top5 = sorted.slice(0, 5)
    const others = sorted.slice(5).reduce((sum, [, count]) => sum + count, 0)

    const labels = top5.map(([name]) => name)
    const data = top5.map(([, count]) => count)

    if (others > 0) {
      labels.push('Autres')
      data.push(others)
    }

    return {
      labels,
      datasets: [{
        label: 'Nombre d\'exercices',
        data,
        backgroundColor: [
          '#d4c4b0',
          '#b8a48f',
          '#9b8772',
          '#7d6d5c',
          '#64594f',
          '#4a4541'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    }
  })

  // Get top 5 exercises
  const topExercises = computed((): ExerciseStats[] => {
    const exerciseStats: Record<string, ExerciseStats> = {}

    filteredWorkouts.value.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const name = exercise.exerciseLibrary?.name || exercise.name
        const volume = exercise.sets?.reduce((sum, set) => {
          return sum + (set.weight || 0) * (set.reps || 0)
        }, 0) || 0

        if (!exerciseStats[name]) {
          exerciseStats[name] = {
            name,
            count: 0,
            totalVolume: 0,
            lastPerformed: workout.completedAt
          }
        }

        exerciseStats[name].count++
        exerciseStats[name].totalVolume += volume

        // Update last performed if more recent
        if (workout.completedAt && (!exerciseStats[name].lastPerformed ||
            new Date(workout.completedAt) > new Date(exerciseStats[name].lastPerformed!))) {
          exerciseStats[name].lastPerformed = workout.completedAt
        }
      })
    })

    return Object.values(exerciseStats)
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 5)
      .map(stat => ({
        ...stat,
        totalVolume: Math.round(stat.totalVolume)
      }))
  })

  // Get personal records
  const personalRecords = computed((): PersonalRecord[] => {
    const records: Record<string, PersonalRecord> = {}

    workouts.value.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const name = exercise.exerciseLibrary?.name || exercise.name

        exercise.sets?.forEach(set => {
          const weight = set.weight || 0
          const reps = set.reps || 0

          if (!records[name] || weight > records[name].maxWeight) {
            records[name] = {
              exerciseName: name,
              exerciseId: exercise.exerciseLibraryId || 0,
              maxWeight: weight,
              reps,
              date: workout.completedAt || '',
              workoutId: workout.id
            }
          }
        })
      })
    })

    return Object.values(records)
      .sort((a, b) => b.maxWeight - a.maxWeight)
      .slice(0, 10)
  })

  // Week-over-week comparison
  const weekComparison = computed((): WeekComparison => {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=Sun, 1=Mon...
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const currentWeekStart = new Date(now)
    currentWeekStart.setHours(0, 0, 0, 0)
    currentWeekStart.setDate(now.getDate() - mondayOffset)

    const previousWeekStart = new Date(currentWeekStart)
    previousWeekStart.setDate(currentWeekStart.getDate() - 7)

    const completedWorkouts = workouts.value.filter(w => w.completedAt)

    const currentWeekWorkouts = completedWorkouts.filter(w => {
      const d = new Date(w.completedAt!)
      return d >= currentWeekStart && d <= now
    })

    const previousWeekWorkouts = completedWorkouts.filter(w => {
      const d = new Date(w.completedAt!)
      return d >= previousWeekStart && d < currentWeekStart
    })

    const calcStats = (list: Workout[]) => ({
      workouts: list.length,
      volume: Math.round(list.reduce((s, w) => s + (w.totalVolume || 0), 0)),
      avgDuration: list.length > 0 ? Math.round(list.reduce((s, w) => s + (w.duration || 0), 0) / list.length) : 0
    })

    const current = calcStats(currentWeekWorkouts)
    const previous = calcStats(previousWeekWorkouts)

    const pctChange = (cur: number, prev: number): number | null => {
      if (prev === 0) return cur > 0 ? 100 : null
      return Math.round(((cur - prev) / prev) * 100)
    }

    return {
      currentWeek: current,
      previousWeek: previous,
      changes: {
        workouts: pctChange(current.workouts, previous.workouts),
        volume: pctChange(current.volume, previous.volume),
        avgDuration: pctChange(current.avgDuration, previous.avgDuration)
      }
    }
  })

  // All unique exercise names (for dropdown)
  const allExerciseNames = computed((): string[] => {
    const names = new Set<string>()
    workouts.value.forEach(w => {
      w.exercises?.forEach(e => {
        const name = e.exerciseLibrary?.name || e.name
        if (name) names.add(name)
      })
    })
    return Array.from(names).sort((a, b) => a.localeCompare(b, 'fr'))
  })

  // Exercise progression data (max weight per session for selected exercise)
  const exerciseProgressionData = computed((): ChartData | null => {
    if (!selectedExercise?.value) return null

    const target = selectedExercise.value
    const sessions: { date: string; maxWeight: number }[] = []

    workouts.value
      .filter(w => w.completedAt)
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
      .forEach(w => {
        let maxWeight = 0
        w.exercises?.forEach(e => {
          const name = e.exerciseLibrary?.name || e.name
          if (name === target) {
            e.sets?.forEach(s => {
              if ((s.weight || 0) > maxWeight) maxWeight = s.weight || 0
            })
          }
        })
        if (maxWeight > 0) {
          sessions.push({ date: w.completedAt!, maxWeight })
        }
      })

    if (sessions.length === 0) return null

    return {
      labels: sessions.map(s => formatDate(s.date)),
      datasets: [{
        label: target,
        data: sessions.map(s => s.maxWeight),
        borderColor: '#b8a48f',
        backgroundColor: 'rgba(184, 164, 143, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    }
  })

  // Helper: Group workouts by date
  function groupByDate(workoutList: Workout[]): Map<string, Workout[]> {
    const grouped = new Map<string, Workout[]>()

    workoutList.forEach(workout => {
      if (!workout.completedAt) return

      const date = new Date(workout.completedAt)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.toISOString().split('T')[0]

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(workout)
    })

    return grouped
  }

  // Helper: Format date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(date)
  }

  // Check if we have data
  const hasData = computed(() => filteredWorkouts.value.length > 0)

  return {
    overviewStats,
    volumeData,
    frequencyData,
    muscleGroupData,
    exerciseDistributionData,
    topExercises,
    personalRecords,
    weekComparison,
    allExerciseNames,
    exerciseProgressionData,
    hasData
  }
}
