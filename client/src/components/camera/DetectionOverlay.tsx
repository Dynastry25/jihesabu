import { useCountingStore } from '../../store/countingStore'

export const DetectionOverlay = () => {
  const { totalCount, maleCount, femaleCount, confidence, processingSpeed, trackedObjects, isActive, category } = useCountingStore()

  if (!isActive) return null

  return (
    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3">
      <div className="bg-dark-card/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-sm">
        <span className="text-dark-muted">Count: </span>
        <span className="text-white font-bold">{totalCount}</span>
      </div>
      {category === 'people' && (
        <>
          <div className="bg-dark-card/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-sm">
            <span className="text-blue-400">♂ {maleCount}</span>
            <span className="text-dark-muted mx-1">|</span>
            <span className="text-pink-400">♀ {femaleCount}</span>
          </div>
        </>
      )}
      <div className="bg-dark-card/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-sm">
        <span className="text-dark-muted">Conf: </span>
        <span className="text-secondary-400 font-medium">{(confidence * 100).toFixed(1)}%</span>
      </div>
      <div className="bg-dark-card/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-sm">
        <span className="text-dark-muted">Speed: </span>
        <span className="text-accent-400 font-medium">{processingSpeed.toFixed(0)}ms</span>
      </div>
      <div className="bg-dark-card/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-sm">
        <span className="text-dark-muted">Tracks: </span>
        <span className="text-primary-400 font-medium">{trackedObjects.length}</span>
      </div>
    </div>
  )
}
