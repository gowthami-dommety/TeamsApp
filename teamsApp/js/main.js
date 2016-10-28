$(document).ready(function() {
    $('#employeeSelect').select2({
		placeholder: "Select an employee",
		'allowClear': true
    });
});


angular.module('TeamApp', [])
.controller('MainController', function($scope, $http) {
	$scope.currentTeamId = null;
	
    $http.get('http://demo5534716.mockable.io/retrieveTeams').
        then(function(response) {
            $scope.teams = response.data.teams;
        });
		
	$scope.SaveTeam = function () {
			var selectedEmployees = $('#employeeSelect').select2('data').map(function(item){console.log(item); return item.id;});

            var data = {
                teamName: $scope.teamName,
                members: selectedEmployees,
                numberOfMembers: selectedEmployees.length,
				teamId: $scope.currentTeamId
            };

            $http.post('http://demo5534716.mockable.io/saveTeam', data)
            .success(function () {
                (data.teamId) ? updateTeam(data.teamId, data) : createTeam(data);
				$('#teamDetailsModal').modal('hide');
            });
        };
		
	$scope.formatEmpList = function(empArray) {
		return empArray.join(", ");
	};
	
	$('#teamDetailsModal').on('show.bs.modal', function (event) {
	  var teamId = $(event.relatedTarget).data('team-id');
	  $scope.currentTeamId = teamId;
	  if(teamId) {
		  var teamSelected = _.findWhere($scope.teams, {teamId: teamId});
		  $scope.$apply(function () {
            $scope.teamName = teamSelected.teamName;
          });
		  $scope.$apply();
		  $('#employeeSelect').val(teamSelected.members).trigger("change");
	  }
	});
	
	$('#teamDetailsModal').on('hidden.bs.modal', function () {
		//clear dialog fields
		$scope.$apply(function () {
          $scope.teamName = "";
        });
		$('#employeeSelect').val("").trigger("change");
	});
	
	function updateTeam(teamId, data) {
		_.each($scope.teams, function(team) {
			if(team.teamId == teamId) {
				team.teamName = data.teamName;
				team.members = data.members;
				team.numberOfMembers = data.members.length;
			}
		});
	};
	
	function createTeam(data) {
		data.teamId = $scope.teams.length + 1;
		$scope.teams.push(data);
	};
});