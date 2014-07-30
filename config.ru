def ensure_load_path_has(path)
  $LOAD_PATH.unshift(path) unless $LOAD_PATH.include?(path)
end
ensure_load_path_has(File.dirname(__FILE__))

require 'app'
run SituationRoom::Monitor
