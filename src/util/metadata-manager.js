var MetadataManager = MetadataManager || {
	
	populateSongMetadataSection : function(simFile) {
		document.getElementById("md_title").innerHTML = simFile.title;
		document.getElementById("md_subtitle").innerHTML = simFile.subtitle;
		document.getElementById("md_artist").innerHTML = simFile.artist;
	},

	populateDifficultySection : function(simFile) {
		if (simFile.difficulties && simFile.difficulties.length) {
			var difficultyPicker = document.getElementById("difficulty_picker");
			while(difficultyPicker.firstChild) {
				difficultyPicker.removeChild(difficultyPicker.firstChild);
			}
			
			for (var i = 0; i < simFile.difficulties.length; i++) {
				var difficulty = simFile.difficulties[i];
				var option = document.createElement("option");
				option.value = i.toString();
				option.innerHTML = difficulty.toString();
				difficultyPicker.appendChild(option);
			}
		}
	}
};